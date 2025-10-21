import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { createOrder, listOrders, myOrders, getOrder, updateStatus } from '../controllers/orderController.js';

const router = Router();

router.use(protect);
router.post('/', createOrder);
router.get('/user', myOrders);
router.get('/:id', getOrder);
router.get('/', adminOnly, listOrders);
router.put('/:id/status', adminOnly, updateStatus);

export default router;


