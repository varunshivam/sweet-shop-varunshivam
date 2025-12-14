import { Request, Response } from "express";
import { SweetModel } from "../models/Sweet";

export const getSweets = async (req: Request, res: Response) => {
  try {
    const sweets = await SweetModel.all();
    res.json(sweets);
  } catch (error: any) {
    console.error("Get sweets error:", error);
    res.status(500).json({ error: "Failed to fetch sweets" });
  }
};

export const getSweetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sweet = await SweetModel.findById(Number(id));

    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    res.json(sweet);
  } catch (error: any) {
    console.error("Get sweet by ID error:", error);
    res.status(500).json({ error: "Failed to fetch sweet" });
  }
};

export const addSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;

    // Validate input
    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (price < 0 || quantity < 0) {
      return res
        .status(400)
        .json({ error: "Price and quantity must be non-negative" });
    }

    const sweet = await SweetModel.create(req.body);
    res.status(201).json(sweet);
  } catch (error: any) {
    console.error("Add sweet error:", error);
    res.status(500).json({ error: "Failed to add sweet" });
  }
};

export const updateSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;

    // Validate input
    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: "Price must be non-negative" });
    }

    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({ error: "Quantity must be non-negative" });
    }

    const sweet = await SweetModel.update(Number(id), req.body);

    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    res.json(sweet);
  } catch (error: any) {
    console.error("Update sweet error:", error);
    res.status(500).json({ error: "Failed to update sweet" });
  }
};

export const deleteSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await SweetModel.delete(Number(id));

    if (!deleted) {
      return res.status(404).json({ error: "Sweet not found" });
    }

    res.json({ message: "Sweet deleted successfully", id: Number(id) });
  } catch (error: any) {
    console.error("Delete sweet error:", error);
    res.status(500).json({ error: "Failed to delete sweet" });
  }
};
