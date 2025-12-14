import { Request, Response } from "express";
import { pool } from "../database";

export const getCart = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        ci.id,
        ci.quantity,
        s.id as sweet_id,
        s.name,
        s.price
      FROM cart_items ci
      JOIN sweets s ON ci.sweet_id = s.id
      WHERE ci.user_id = $1
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const addToCart = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { sweet_id, quantity } = req.body;

    if (!sweet_id || !quantity) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const result = await pool.query(
      `
      INSERT INTO cart_items (user_id, sweet_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, sweet_id)
      DO UPDATE SET quantity = cart_items.quantity + $3
      RETURNING *
      `,
      [userId, sweet_id, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const updateCartItem = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    await pool.query(
      `
      UPDATE cart_items
      SET quantity = $1
      WHERE id = $2 AND user_id = $3
      `,
      [quantity, id, userId]
    );

    res.json({ message: "Updated" });
  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

export const removeFromCart = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await pool.query(`DELETE FROM cart_items WHERE id = $1 AND user_id = $2`, [
      id,
      userId,
    ]);

    res.json({ message: "Removed" });
  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
};
