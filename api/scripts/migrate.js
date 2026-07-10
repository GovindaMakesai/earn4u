/**
 * Runs the initial SQL migration against PostgreSQL on startup.
 * Skips if the schema is already present (safe for Render free tier restarts).
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  await client.connect();
  try {
    const { rows } = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'users' AND table_name = 'profiles'
      ) AS ready
    `);

    if (rows[0]?.ready) {
      console.log('Database schema already exists — skipping migration');
      return;
    }

    const sqlPath = path.join(__dirname, '../src/database/migrations/001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await client.query(sql);
    console.log('Migration completed successfully');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
