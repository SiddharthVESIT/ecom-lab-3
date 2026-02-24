import { query } from '../../config/db.js';

export async function listProductsByCategory(category) {
  const baseSql = `
    SELECT id, name, category, description, price_cents, image_url, is_active
    FROM products
    WHERE is_active = TRUE
  `;

  const sql = category
    ? `${baseSql} AND category = $1 ORDER BY created_at DESC`
    : `${baseSql} ORDER BY created_at DESC`;

  const params = category ? [category] : [];
  const { rows } = await query(sql, params);
  return rows;
}
