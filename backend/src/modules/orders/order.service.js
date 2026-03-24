import * as orderRepo from './order.repository.js';
import * as cartRepo from '../cart/cart.repository.js';

import crypto from 'crypto';

export async function processCheckout(userId, shippingAddress, billingAddress) {
    // 1. Get active cart
    const cart = await cartRepo.getActiveCartByUserId(userId);
    if (!cart) throw new Error('No active cart found');

    // 2. Get cart items
    const items = await cartRepo.getCartSummary(cart.id);
    if (!items || items.length === 0) throw new Error('Cart is empty');

    // 3. Calculate total and verify stock
    const totalAmountCents = items.reduce((sum, item) => sum + Number(item.line_total_cents), 0);

    for (const item of items) {
        // Validate stock availability
        const success = await orderRepo.updateProductStock(item.product_id, item.quantity);
        if (!success) {
            throw new Error(`Insufficient stock for product: ${item.name}`);
        }
    }

    // 4. Create Order
    const orderNumber = `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const order = await orderRepo.createOrderRecord(
        userId,
        cart.id,
        orderNumber,
        totalAmountCents,
        totalAmountCents // using totalAmountCents for total_cents too as shipping is free
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

    return order;
}

export async function getUserOrders(userId) {
    return orderRepo.getUserOrders(userId);
}
