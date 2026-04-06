import { Router } from 'express';
import { getOrders, getOrderDetails, updateOrder, getInventory, updateInventory, getCustomers, getStats, getSalesAnalytics, getAbandonedCarts, getProcurement, restockProduct } from './admin.controller.js';
import { requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAdmin);

router.get('/orders', getOrders);
router.get('/orders/:id/details', getOrderDetails);
router.put('/orders/:id', updateOrder);

router.get('/inventory', getInventory);
router.put('/inventory/:id', updateInventory);

router.get('/customers', getCustomers);
router.get('/stats', getStats);
router.get('/sales-analytics', getSalesAnalytics);

// CRM/ERP Routes
router.get('/abandoned-carts', getAbandonedCarts);
router.get('/procurement', getProcurement);
router.post('/procurement/:id/restock', restockProduct);

export default router;
