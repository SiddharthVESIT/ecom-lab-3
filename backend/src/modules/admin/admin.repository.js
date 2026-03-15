import { query } from '../../config/db.js';

export async function getAllOrders() {
    const { rows } = await query(`
    SELECT o.id, o.user_id, o.status, o.total_cents as total_amount_cents, o.created_at, u.full_name as customer_name, u.email as customer_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `);
    return rows;
}

export async function getOrderDetails(orderId) {
    const { rows } = await query(`
    SELECT oi.id, oi.quantity, oi.price_at_purchase_cents, p.name as product_name, p.sku as product_sku
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
  `, [orderId]);
    return rows;
}

export async function updateOrderStatus(orderId, status) {
    const { rows } = await query(
        'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
        [status, orderId]
    );
    return rows[0];
}

export async function getAllProducts() {
    const { rows } = await query('SELECT id, name, category, stock_count, price_cents, is_active FROM products ORDER BY name ASC');
    return rows;
}

export async function updateProductStock(productId, stockCount) {
    const { rows } = await query(
        'UPDATE products SET stock_count = $1 WHERE id = $2 RETURNING *',
        [stockCount, productId]
    );
    return rows[0];
}
