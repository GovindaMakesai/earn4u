/**
 * Runs the initial SQL migration against PostgreSQL.
 * Used by Render preDeployCommand.
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

  const sqlPath = path.join(__dirname, '../src/database/migrations/001_initial_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  await client.connect();
  try {
    await client.query(sql);
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE users.verification_type AS ENUM ('identity','creator','agency');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
      ALTER TABLE users.profiles ADD COLUMN IF NOT EXISTS verification_type users.verification_type;
    `);
    console.log('Migration completed successfully');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
