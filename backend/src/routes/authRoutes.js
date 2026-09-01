import { Router } from 'express';
import { registerUser, loginUser, googleLogin } from '../controllers/authController.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);

export default router;
