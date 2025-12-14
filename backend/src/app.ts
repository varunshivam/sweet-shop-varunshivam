import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import sweetRoutes from "./routes/sweetRoutes";
import cartRoutes from "./routes/cartRoutes";

const app = express();

// ✅ FIRST
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ THEN BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);
app.use("/api/cart", cartRoutes);

// Health
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
