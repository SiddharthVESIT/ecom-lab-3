import { Router } from 'express';
import { getProductReviews, createReview } from './reviews.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public route to get reviews
router.get('/:productId', getProductReviews);

// Protected route to create review
router.post('/', requireAuth, createReview);

export default router;
