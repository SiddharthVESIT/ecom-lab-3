import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { createOrder, downloadInvoice, getMyOrders } from './order.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/', getMyOrders);
router.post('/', createOrder);
router.get('/:orderId/invoice', downloadInvoice);

export default router;
