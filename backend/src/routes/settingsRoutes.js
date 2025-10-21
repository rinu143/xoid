import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { getAll, getByKey, upsert, remove, getPublicGeminiKey } from '../controllers/settingsController.js';

const router = Router();

router.get('/public/gemini-key', protect, getPublicGeminiKey);

router.use(protect, adminOnly);
router.get('/', getAll);
router.get('/:key', getByKey);
router.post('/', upsert);
router.put('/:key', upsert);
router.delete('/:key', remove);

export default router;


