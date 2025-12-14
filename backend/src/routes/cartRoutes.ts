import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate, getCart);
router.post("/", authenticate, addToCart);
router.put("/:id", authenticate, updateCartItem);
router.delete("/:id", authenticate, removeFromCart);

export default router;
