import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "sweetshop",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

export const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sweets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Database tables initialized successfully");

    // Create a default admin user if none exists
    const adminCheck = await pool.query(
      "SELECT * FROM users WHERE is_admin = true"
    );

    if (adminCheck.rows.length === 0) {
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await pool.query(
        "INSERT INTO users(username, email, password, is_admin) VALUES($1, $2, $3, $4)",
        ["admin", "admin@sweetshop.com", hashedPassword, true]
      );

      console.log("✅ Default admin user created:");
      console.log("   Email: admin@sweetshop.com");
      console.log("   Password: admin123");
    }

    // Add some sample sweets if table is empty
    const sweetCheck = await pool.query("SELECT COUNT(*) FROM sweets");

    if (sweetCheck.rows[0].count === "0") {
      const sampleSweets = [
        {
          name: "Gulab Jamun",
          category: "Traditional",
          price: 120,
          quantity: 50,
        },
        { name: "Rasgulla", category: "Traditional", price: 100, quantity: 45 },
        { name: "Jalebi", category: "Traditional", price: 80, quantity: 60 },
        { name: "Kaju Katli", category: "Premium", price: 350, quantity: 30 },
        { name: "Barfi", category: "Traditional", price: 200, quantity: 40 },
        { name: "Ladoo", category: "Traditional", price: 150, quantity: 55 },
        {
          name: "Chocolate Barfi",
          category: "Modern",
          price: 250,
          quantity: 25,
        },
        { name: "Rasmalai", category: "Premium", price: 180, quantity: 35 },
      ];

      for (const sweet of sampleSweets) {
        await pool.query(
          "INSERT INTO sweets(name, category, price, quantity) VALUES($1, $2, $3, $4)",
          [sweet.name, sweet.category, sweet.price, sweet.quantity]
        );
      }

      console.log("✅ Sample sweets added to database");
    }
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
};

// Test database connection
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err);
  process.exit(-1);
});
