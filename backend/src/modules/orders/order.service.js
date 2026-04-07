import * as orderRepo from './order.repository.js';
import * as cartRepo from '../cart/cart.repository.js';
import crypto from 'crypto';
import { query } from '../../config/db.js';

export async function processCheckout(userId, shippingAddress, billingAddress, pointsToRedeem = 0) {
    // 1. Get active cart
    const cart = await cartRepo.getActiveCartByUserId(userId);
    if (!cart) throw new Error('No active cart found');

    // 2. Get cart items
    const items = await cartRepo.getCartSummary(cart.id);
    if (!items || items.length === 0) throw new Error('Cart is empty');

    // 3. User & Points Validation
    const userRes = await query('SELECT loyalty_points FROM users WHERE id = $1', [userId]);
    const userPoints = userRes.rows[0]?.loyalty_points || 0;

    if (pointsToRedeem > userPoints) {
        throw new Error('Insufficient loyalty points');
    }

    // 4. Calculate total and verify stock
    const subtotalPaise = items.reduce((sum, item) => sum + Number(item.line_total_cents), 0);
    
    // Calculate Discount: 10 points = 1 INR = 100 Paise
    const discountPaise = Math.floor(pointsToRedeem / 10) * 100;
    const totalPaise = Math.max(0, subtotalPaise - discountPaise);

    for (const item of items) {
        // Validate stock availability
        const success = await orderRepo.updateProductStock(item.product_id, item.quantity);
        if (!success) {
            throw new Error(`Insufficient stock for product: ${item.name}`);
        }
    }

    // 5. Create Order
    const orderNumber = `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const order = await orderRepo.createOrderRecord(
        userId,
        cart.id,
        orderNumber,
        subtotalPaise,
        totalPaise,
        pointsToRedeem,
        discountPaise
    );

    // 6. Create Order Items and Update User Points
    for (const item of items) {
        await orderRepo.createOrderItem(
            order.id,
            item.product_id,
            item.quantity,
            item.price_cents
        );
        // Remove from cart
        await cartRepo.deleteCartItem(cart.id, item.product_id);
    }

    // 7. Update Loyalty Points: [Deduct Redeemed] + [Earn New (1 per INR)]
    const pointsEarned = Math.floor(subtotalPaise / 100);
    const netPointsChange = pointsEarned - pointsToRedeem;
    
    await query(
        'UPDATE users SET loyalty_points = loyalty_points + $1 WHERE id = $2',
        [netPointsChange, userId]
    );

    return { ...order, points_earned: pointsEarned };
}

export async function getUserOrders(userId) {
    return orderRepo.getUserOrders(userId);
}
