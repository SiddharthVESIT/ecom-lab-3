import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
  connectionString: 'postgresql://amai_backend_user:xIyqSGROLjqMxCfkE3LNzgxn8bg3lNuN@dpg-d77bi6tm5p6s739i7qv0-a.singapore-postgres.render.com/amai_backend',
  ssl: { rejectUnauthorized: false }
});

const industryCodes = [
    { name: 'Amai Ambassador', email: 'ambassador@amai.jp', code: 'AMAI-ELITE' },
    { name: 'Corporate Gifts', email: 'gifts@amai.jp', code: 'AMAI-CORP' },
    { name: 'Tokyo Tastemaker', email: 'tokyo@amai.jp', code: 'TOKYO-VIBE' },
    { name: 'VIP Connoisseur', email: 'vip@amai.jp', code: 'VIP-GOLD' },
    { name: 'Matcha Master', email: 'matcha@amai.jp', code: 'MATCHA-FAN' },
    { name: 'Sakura Society', email: 'sakura@amai.jp', code: 'SPRING-JOY' },
    { name: 'Craft Chocolate', email: 'craft@amai.jp', code: 'ARTISAN20' },
    { name: 'Cacao Curators', email: 'cacao@amai.jp', code: 'CACAO-CLUB' },
    { name: 'Zen Minimalist', email: 'zen@amai.jp', code: 'ZEN-CHOCO' },
    { name: 'Yuzu Enthusiast', email: 'yuzu@amai.jp', code: 'YUZU-LOVE' }
];

async function run() {
  await client.connect();
  try {
    // Generate identical password for all mock accounts
    const passwordHash = await bcrypt.hash('AmaiReferrer123!', 10);
    
    for (const ref of industryCodes) {
      // Check if code exists to avoid duplicates
      const exists = await client.query('SELECT id FROM users WHERE email = $1 OR referral_code = $2', [ref.email, ref.code]);
      
      if (exists.rows.length === 0) {
        await client.query(
          `INSERT INTO users (full_name, email, password_hash, role, loyalty_points, referral_code) 
           VALUES ($1, $2, $3, 'customer', 5000, $4)`,
          [ref.name, ref.email, passwordHash, ref.code]
        );
        console.log(`Created referral account for ${ref.name} with code ${ref.code}`);
      } else {
        console.log(`Code ${ref.code} or email ${ref.email} already exists, skipping.`);
      }
    }
    
    console.log("Successfully seeded industry-level referral codes.");
  } catch (err) {
    console.error('Database migration failed:', err.message);
  } finally {
    await client.end();
  }
}
run();
