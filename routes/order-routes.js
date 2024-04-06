import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { createOrder, getOrdersByUser, paymentSuccess } from "../controller/order-controller.js";

const router = Router();

router.post('/place-order', verifyToken, createOrder);
router.post('/success', verifyToken, paymentSuccess);
router.get('/user-orders', verifyToken, getOrdersByUser);


export default router;