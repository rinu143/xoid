import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, logout, me, changePassword, updateProfile, requestOTP, verifyOTP, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', [body('email').isEmail(), body('password').isLength({ min: 6 }), body('name').notEmpty()], register);
router.post('/login', [body('email').isEmail(), body('password').notEmpty()], login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);
router.post('/change-password', protect, changePassword);
router.put('/update-profile', protect, updateProfile);
router.post('/forgot-password', [body('email').isEmail()], requestOTP);
router.post('/verify-otp', [body('email').isEmail(), body('otp').isLength({ min: 6, max: 6 })], verifyOTP);
router.post('/reset-password', [body('email').isEmail(), body('otp').isLength({ min: 6, max: 6 }), body('newPassword').isLength({ min: 6 })], resetPassword);

export default router;


