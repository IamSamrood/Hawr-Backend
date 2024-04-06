import { Router } from "express";
import { addToCart, getCartByUser } from "../controller/cart-controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

// Route to add an item to the cart
router.post('/add-to-cart', verifyToken, addToCart);

// Route to get the cart by user ID
router.get('/get-cart', verifyToken, getCartByUser);

export default router;
