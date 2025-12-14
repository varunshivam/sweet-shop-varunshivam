import bcrypt from "bcrypt";
import { pool } from "../database";

export class UserModel {
  static async create(username: string, email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const res = await pool.query(
      "INSERT INTO users(username, email, password, is_admin) VALUES($1, $2, $3, $4) RETURNING *",
      [username, email, hash, false]
    );
    return res.rows[0];
  }

  static async findByEmail(email: string) {
    const res = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return res.rows[0];
  }

  static async findById(id: number) {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0];
  }

  static async compare(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateToAdmin(email: string) {
    const res = await pool.query(
      "UPDATE users SET is_admin = true WHERE email = $1 RETURNING *",
      [email]
    );
    return res.rows[0];
  }

  static async all() {
    const res = await pool.query(
      "SELECT id, username, email, is_admin FROM users"
    );
    return res.rows;
  }
}
