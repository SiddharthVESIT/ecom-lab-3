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
    const { rows } = await client.query(`
        SELECT table_name FROM information_schema.tables WHERE table_schema='public'
    `);
    console.log("Tables:", rows.map(r => r.table_name));
  } catch (err) {
    console.error('ERROR HERE:', err.message);
  } finally {
    await client.end();
  }
}
run();
