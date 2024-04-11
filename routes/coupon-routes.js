import { Router } from "express";
import { addCoupon, applyCoupon, checkCouponValid, getAllCoupon } from "../controller/coupon-controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post('/', addCoupon);
router.get('/', getAllCoupon);
router.post('/check', verifyToken, checkCouponValid);

export default router;