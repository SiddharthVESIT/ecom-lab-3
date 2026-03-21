import { Router } from 'express';
import { addItem, getMyCart, updateItem, removeItem } from './cart.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getMyCart);
router.post('/items', addItem);
router.patch('/items/:productId', updateItem);
router.delete('/items/:productId', removeItem);

export default router;
