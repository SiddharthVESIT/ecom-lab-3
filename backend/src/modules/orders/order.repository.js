import { query } from '../../config/db.js';

export async function createOrderRecord(userId, cartId, orderNumber, subtotalCents, totalCents) {
  const sql = `
    INSERT INTO orders (user_id, cart_id, order_number, subtotal_cents, total_cents, status)
    VALUES ($1, $2, $3, $4, $5, 'pending')
    RETURNING *
  `;
  const { rows } = await query(sql, [userId, cartId, orderNumber, subtotalCents, totalCents]);
  return rows[0];
}

export async function createOrderItem(orderId, productId, quantity, priceCents) {
  const sql = `
    INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase_cents)
    VALUES ($1, $2, $3, $4)
  `;
  await query(sql, [orderId, productId, quantity, priceCents]);
}

export async function updateProductStock(productId, decrementBy) {
  const sql = `
    UPDATE products 
    SET stock_count = stock_count - $1 
    WHERE id = $2 AND stock_count >= $1
    RETURNING id
  `;
  const { rows } = await query(sql, [decrementBy, productId]);
  return rows.length > 0;
}

export async function updateOrderStatus(orderId, status) {
  const sql = `
    UPDATE orders 
    SET status = $1 
    WHERE id = $2
    RETURNING *
  `;
  const { rows } = await query(sql, [status, orderId]);
  return rows[0];
}

export async function getOrderItems(orderId) {
  const sql = `
    SELECT oi.*, p.name 
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
  `;
  const { rows } = await query(sql, [orderId]);
  return rows;
}

export async function getUserOrders(userId) {
  const sql = `
    SELECT 
      o.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'price_cents', oi.price_at_purchase_cents,
            'product', json_build_object('name', p.name)
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN products p ON p.id = oi.product_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  const { rows } = await query(sql, [userId]);
  return rows;
}
