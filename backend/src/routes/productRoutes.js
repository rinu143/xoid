import { Router } from 'express';
import { list, getById, create, update, remove, updateStock } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', list);
router.get('/:id', getById);
router.post('/', protect, adminOnly, upload.array('images', 6), create);
router.put('/:id', protect, adminOnly, update);
router.put('/:id/stock', protect, adminOnly, updateStock);
router.delete('/:id', protect, adminOnly, remove);

export default router;


