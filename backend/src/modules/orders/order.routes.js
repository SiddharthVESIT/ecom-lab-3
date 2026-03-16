import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { createOrder, downloadInvoice } from './order.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/', (_req, res) => {
  res.status(200).json({ message: 'Order service stub - ready for extraction to microservice.' });
});
router.post('/', createOrder);
router.get('/:orderId/invoice', downloadInvoice);

export default router;
