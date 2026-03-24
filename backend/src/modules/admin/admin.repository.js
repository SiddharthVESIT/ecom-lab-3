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

export async function getCustomersAnalytics() {
    const { rows } = await query(`
        SELECT 
            u.id, 
            u.full_name, 
            u.email, 
            u.created_at as joined_date,
            COUNT(o.id) as total_orders,
            COALESCE(SUM(o.total_cents), 0) as lifetime_value_cents
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id AND o.status != 'cancelled'
        WHERE u.role = 'customer'
        GROUP BY u.id
        ORDER BY lifetime_value_cents DESC
    `);
    return rows;
}

export async function getDashboardStats() {
    // Total Revenue (completed/shipped/paid)
    const revenueQuery = await query(`
        SELECT COALESCE(SUM(total_cents), 0) as total_revenue_cents 
        FROM orders 
        WHERE status IN ('paid', 'shipped', 'completed')
    `);
    
    // Total Orders
    const ordersQuery = await query(`
        SELECT COUNT(id) as total_orders 
        FROM orders
    `);
    
    // Low stock items (< 20)
    const stockQuery = await query(`
        SELECT COUNT(id) as low_stock_count 
        FROM products 
        WHERE stock_count < 20 AND is_active = true
    `);
    
    return {
        revenue_cents: revenueQuery.rows[0].total_revenue_cents,
        total_orders: ordersQuery.rows[0].total_orders,
        low_stock_count: stockQuery.rows[0].low_stock_count
    };
}

export async function getProductSalesAnalytics() {
    const { rows } = await query(`
        SELECT 
            p.id,
            p.name as product_name,
            p.category,
            COALESCE(SUM(oi.quantity), 0) as total_units_sold,
            COALESCE(SUM(oi.quantity * oi.price_at_purchase_cents), 0) as total_revenue_cents
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id AND o.status IN ('paid', 'shipped', 'completed')
        GROUP BY p.id
        HAVING COALESCE(SUM(oi.quantity), 0) > 0
        ORDER BY total_revenue_cents DESC
    `);
    return rows;
}
