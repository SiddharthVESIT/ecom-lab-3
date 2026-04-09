import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
  connectionString: 'postgresql://amai_backend_user:xIyqSGROLjqMxCfkE3LNzgxn8bg3lNuN@dpg-d77bi6tm5p6s739i7qv0-a.singapore-postgres.render.com/amai_backend',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  try {
    const result = await client.query("SELECT full_name, email FROM users WHERE role = 'admin'");
    console.log("Admin Users:");
    console.log(result.rows);
  } catch (err) {
    console.error('Database query failed:', err.message);
  } finally {
    await client.end();
  }
}
run();
