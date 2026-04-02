import fs from 'fs';
import path from 'path';
import pkg from 'pg';
import { fileURLToPath } from 'url';

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONNECTION_STRING = 'postgresql://amai_backend_user:xIyqSGROLjqMxCfkE3LNzgxn8bg3lNuN@dpg-d77bi6tm5p6s739i7qv0-a.singapore-postgres.render.com/amai_backend';

async function seedDatabase() {
    console.log("Connecting to remote Render PostgreSQL Database...");
    
    // Setting ssl: { rejectUnauthorized: false } is mandatory for connecting to Render DBs from outside their network
    const client = new Client({
        connectionString: CONNECTION_STRING,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        
        console.log("Connected successfully!");
        
        console.log("1/3 Building the database tables...");
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log("✓ Schema created successfully!");

        console.log("2/3 Synthesizing AMAI chocolate catalog...");
        const seedPath = path.join(__dirname, '../database/seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await client.query(seedSql);
        console.log("✓ Products seeded successfully!");
        
        console.log("3/3 Pre-populating testing accounts and orders...");
        const dummyPath = path.join(__dirname, '../database/seed_dummy_data.sql');
        const dummySql = fs.readFileSync(dummyPath, 'utf8');
        await client.query(dummySql);
        console.log("✓ Dummy data seeded successfully!");

        console.log("\n🎉 The live database is now perfectly seeded. Your platform is ready for business!");
    } catch (err) {
        console.error("Error executing database scripts:", err);
    } finally {
        await client.end();
        console.log("Connection securely closed.");
    }
}

seedDatabase();
