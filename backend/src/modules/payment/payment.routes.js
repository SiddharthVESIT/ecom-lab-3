import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { createRazorpayOrder, verifyRazorpayPayment } from './payment.controller.js';

const router = Router();

router.use(requireAuth);

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyRazorpayPayment);

export default router;
