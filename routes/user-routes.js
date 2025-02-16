import { Router } from "express";
import { getUserProfile, login, register, updateUserProfile } from "../controller/user-controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post('/signup', register);
router.post('/login', login);
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile)

export default router;