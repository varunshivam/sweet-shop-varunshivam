import { pool } from "../database";

interface SweetData {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export class SweetModel {
  static async all() {
    const res = await pool.query("SELECT * FROM sweets ORDER BY id DESC");
    return res.rows;
  }

  static async findById(id: number) {
    const res = await pool.query("SELECT * FROM sweets WHERE id = $1", [id]);
    return res.rows[0];
  }

  static async create(data: SweetData) {
    const res = await pool.query(
      "INSERT INTO sweets(name, category, price, quantity) VALUES($1, $2, $3, $4) RETURNING *",
      [data.name, data.category, data.price, data.quantity]
    );
    return res.rows[0];
  }

  static async update(id: number, data: Partial<SweetData>) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(data.name);
      paramCount++;
    }
    if (data.category !== undefined) {
      fields.push(`category = $${paramCount}`);
      values.push(data.category);
      paramCount++;
    }
    if (data.price !== undefined) {
      fields.push(`price = $${paramCount}`);
      values.push(data.price);
      paramCount++;
    }
    if (data.quantity !== undefined) {
      fields.push(`quantity = $${paramCount}`);
      values.push(data.quantity);
      paramCount++;
    }

    if (fields.length === 0) {
      return null;
    }

    values.push(id);
    const query = `UPDATE sweets SET ${fields.join(
      ", "
    )} WHERE id = $${paramCount} RETURNING *`;

    const res = await pool.query(query, values);
    return res.rows[0];
  }

  static async delete(id: number) {
    const res = await pool.query(
      "DELETE FROM sweets WHERE id = $1 RETURNING *",
      [id]
    );
    return res.rows[0];
  }

  static async updateQuantity(id: number, quantity: number) {
    const res = await pool.query(
      "UPDATE sweets SET quantity = $1 WHERE id = $2 RETURNING *",
      [quantity, id]
    );
    return res.rows[0];
  }
}
