import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { createOrder, getAllOrders, getOrderById, getOrdersByUser, paymentSuccess, updateOrderStatus } from "../controller/order-controller.js";

const router = Router();

router.get('/', getAllOrders);
router.put('/:id', updateOrderStatus);
router.post('/place-order',  createOrder);
router.post('/success', paymentSuccess);
router.get('/user-orders', verifyToken, getOrdersByUser);
router.get('/order-id', verifyToken, getOrderById);

export default router;