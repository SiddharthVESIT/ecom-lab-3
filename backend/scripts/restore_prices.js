import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pg;
const client = new Client({
  connectionString: 'postgresql://amai_backend_user:xIyqSGROLjqMxCfkE3LNzgxn8bg3lNuN@dpg-d77bi6tm5p6s739i7qv0-a.singapore-postgres.render.com/amai_backend',
  ssl: { rejectUnauthorized: false }
});

const correctPrices = {
  'SB-MATCHA-001': 1850 * 100,
  'SB-YUZU-002': 2100 * 100,
  'SB-SAKURA-003': 1950 * 100,
  'SB-HOJICHA-004': 1750 * 100,
  'SB-WASABI-005': 2200 * 100,
  'SB-MISO-006': 1900 * 100,
  'BR-DARKSEA-001': 1200 * 100,
  'BR-MATMILK-002': 1400 * 100,
  'BR-GENMAICHA-003': 1100 * 100,
  'BR-SESAME-004': 1300 * 100,
  'BR-KINAKO-005': 1250 * 100,
  'HM-AMAI-001': 8500 * 100,
  'HM-SAKURA-002': 6200 * 100,
  'HM-TASTING-003': 4500 * 100,
  'HM-IMPERIAL-004': 15000 * 100
};

async function run() {
  await client.connect();
  try {
    for (const [sku, price] of Object.entries(correctPrices)) {
      await client.query('UPDATE products SET price_cents = $1 WHERE sku = $2', [price, sku]);
      console.log(`Updated ${sku} to ${price}`);
    }
  } catch (err) {
    console.error('Database query failed:', err.message);
  } finally {
    await client.end();
  }
}
run();
