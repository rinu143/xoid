import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createOrder, verifySignature } from '../controllers/paymentController.js';

const router = Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifySignature);

export default router;


