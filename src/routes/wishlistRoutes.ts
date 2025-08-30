import express from 'express';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlistController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/:hostelId')
  .delete(protect, removeFromWishlist);

export default router;