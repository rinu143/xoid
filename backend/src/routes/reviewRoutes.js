import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { listByProduct, create, update, remove } from '../controllers/reviewController.js';

const router = Router();

router.get('/product/:productId', listByProduct);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

export default router;


