import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import productRoutes from '../modules/products/product.routes.js';
import cartRoutes from '../modules/cart/cart.routes.js';
import orderRoutes from '../modules/orders/order.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import paymentRoutes from '../modules/payment/payment.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import reviewRoutes from '../modules/reviews/reviews.routes.js';
import referralRoutes from '../modules/referrals/referrals.routes.js';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'amai-api-gateway' });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/payment', paymentRoutes);
apiRouter.use('/users', usersRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/referrals', referralRoutes);

export default apiRouter;
