import { Router } from "express";
import {
  addSweet,
  getSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
} from "../controllers/sweetController";
import { authenticate, isAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.get("/", getSweets);
router.get("/:id", getSweetById);

// Protected routes (Admin only)
router.post("/", authenticate, isAdmin, addSweet);
router.put("/:id", authenticate, isAdmin, updateSweet);
router.delete("/:id", authenticate, isAdmin, deleteSweet);

export default router;
