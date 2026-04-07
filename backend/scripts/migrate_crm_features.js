import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('render.com') ? { rejectUnauthorized: false } : false
});

async function migrate() {
  console.log('🚀 Starting CRM Features Migration...');

  try {
    // 1. Add columns to users table
    console.log('--- Updating users table... ---');
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS flavor_profile VARCHAR(50),
      ADD COLUMN IF NOT EXISTS loyalty_points INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;
    `);

    // 2. Update orders table
    console.log('--- Updating orders table... ---');
    await pool.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS points_redeemed INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS discount_paise INTEGER NOT NULL DEFAULT 0;
    `);

    // 3. Create new tables
    console.log('--- Creating reviews table... ---');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id BIGSERIAL PRIMARY KEY,
        product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log('--- Creating referrals table... ---');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS referrals (
        id BIGSERIAL PRIMARY KEY,
        referrer_id UUID NOT NULL REFERENCES users(id),
        referee_id UUID NOT NULL REFERENCES users(id),
        referral_code VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        reward_granted BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT unique_referral UNIQUE (referee_id)
      );
    `);

    console.log('--- Creating subscriptions table... ---');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        product_id BIGINT NOT NULL REFERENCES products(id),
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 4. Update Product Prices to INR (Paise)
    console.log('--- Updating product prices to premium INR ranges... ---');
    
    // Update individual items (Bars, Bonbons)
    await pool.query(`
      UPDATE products 
      SET price_cents = 25000 + floor(random() * 60000) 
      WHERE category IN ('bars', 'signature_bonbons');
    `);

    // Update hampers (1000+)
    await pool.query(`
      UPDATE products 
      SET price_cents = 120000 + floor(random() * 200000) 
      WHERE category = 'hampers';
    `);

    // 5. Generate Referral Codes for existing users
    console.log('--- Generating referral codes for existing users... ---');
    const users = await pool.query('SELECT id, full_name FROM users WHERE referral_code IS NULL');
    for (const user of users.rows) {
      const code = (user.full_name.split(' ')[0] || 'AMAI').toUpperCase() + Math.floor(100 + Math.random() * 900);
      await pool.query('UPDATE users SET referral_code = $1 WHERE id = $2', [code, user.id]);
    }

    console.log('✅ Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
