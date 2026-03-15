import { Router } from 'express';
import { getOrders, getOrderDetails, updateOrder, getInventory, updateInventory } from './admin.controller.js';
import { requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAdmin);

router.get('/orders', getOrders);
router.get('/orders/:id/details', getOrderDetails);
router.put('/orders/:id', updateOrder);

router.get('/inventory', getInventory);
router.put('/inventory/:id', updateInventory);

export default router;
