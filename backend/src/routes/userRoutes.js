import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { listUsers, getUserById, updateUserRole, addAddress, updateAddress, deleteAddress, setDefaultAddress, getWishlist, addToWishlist, removeFromWishlist } from '../controllers/userController.js';

const router = Router();

router.use(protect);

// Admin
router.get('/', adminOnly, listUsers);
router.get('/:id', adminOnly, getUserById);
router.put('/:id/role', adminOnly, updateUserRole);

// Addresses
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.put('/addresses/:addressId/default', setDefaultAddress);

// Wishlist
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

export default router;


