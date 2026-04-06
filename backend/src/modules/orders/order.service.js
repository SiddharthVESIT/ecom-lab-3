import * as orderRepo from './order.repository.js';
import * as cartRepo from '../cart/cart.repository.js';
import { query } from '../../config/db.js';

import crypto from 'crypto';

export async function processCheckout(userId, shippingAddress, billingAddress, appliedPoints = 0) {
    // 1. Get active cart
    const cart = await cartRepo.getActiveCartByUserId(userId);
    if (!cart) throw new Error('No active cart found');

    // 2. Get cart items
    const items = await cartRepo.getCartSummary(cart.id);
    if (!items || items.length === 0) throw new Error('Cart is empty');

    // 3. Calculate total and verify stock
    let totalAmountCents = items.reduce((sum, item) => sum + Number(item.line_total_cents), 0);

    // Apply loyalty discount (1 point = 1 INR = 100 cents)
    const discountCents = Math.min(appliedPoints * 100, totalAmountCents);
    totalAmountCents -= discountCents;

    for (const item of items) {
        // Validate stock availability
        const success = await orderRepo.updateProductStock(item.product_id, item.quantity);
        if (!success) {
            throw new Error(`Insufficient stock for product: ${item.name}`);
        }
    }

    // Deduct used loyalty points
    if (appliedPoints > 0) {
        await query('UPDATE users SET loyalty_points = loyalty_points - $1 WHERE id = $2', [appliedPoints, userId]);
    }

    // 4. Create Order
    const orderNumber = `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const order = await orderRepo.createOrderRecord(
        userId,
        cart.id,
        orderNumber,
        totalAmountCents + discountCents, // Original subtotal
        totalAmountCents // Final amount paid
    );

    // 5. Create Order Items
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

    // 6. Reward new loyalty points (1 point per 100 INR spent) -> 1 point per 10000 cents
    const pointsEarned = Math.floor(totalAmountCents / 10000);
    if (pointsEarned > 0) {
        await query('UPDATE users SET loyalty_points = loyalty_points + $1 WHERE id = $2', [pointsEarned, userId]);
    }

    return order;
}

export async function getUserOrders(userId) {
    return orderRepo.getUserOrders(userId);
}
