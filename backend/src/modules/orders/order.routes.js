import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', (_req, res) => {
  res.status(200).json({ message: 'Order service stub - ready for extraction to microservice.' });
});

export default router;
