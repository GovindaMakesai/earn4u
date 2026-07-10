/**
 * Idempotent admin seed — creates admin@earn4u.app if missing.
 */
const bcrypt = require('bcrypt');
const { Client } = require('pg');

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@earn4u.app';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || 'earn4u_admin';
const ADMIN_DISPLAY_NAME = process.env.SEED_ADMIN_DISPLAY_NAME || 'Earn4U Admin';

function createClient() {
  return new Client({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl:
      process.env.DATABASE_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
  });
}

async function main() {
  const client = createClient();
  await client.connect();

  try {
    const existing = await client.query(
      `SELECT p.id, p.role
       FROM auth.users_credentials c
       JOIN users.profiles p ON p.id = c.user_id
       WHERE c.email = $1`,
      [ADMIN_EMAIL],
    );

    if (existing.rows.length > 0) {
      const row = existing.rows[0];
      if (row.role !== 'admin' && row.role !== 'super_admin' && row.role !== 'owner') {
        await client.query(
          `UPDATE users.profiles SET role = 'admin', status = 'active' WHERE id = $1`,
          [row.id],
        );
        console.log(`Updated existing user ${ADMIN_EMAIL} to admin role`);
      } else {
        console.log(`Admin user ${ADMIN_EMAIL} already exists — skipping`);
      }
      return;
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await client.query('BEGIN');

    const profileResult = await client.query(
      `INSERT INTO users.profiles (username, display_name, role, status)
       VALUES ($1, $2, 'admin', 'active')
       RETURNING id`,
      [ADMIN_USERNAME, ADMIN_DISPLAY_NAME],
    );

    const userId = profileResult.rows[0].id;

    await client.query(
      `INSERT INTO auth.users_credentials (user_id, email, password_hash, email_verified)
       VALUES ($1, $2, $3, true)`,
      [userId, ADMIN_EMAIL, passwordHash],
    );

    await client.query(
      `INSERT INTO economy.wallets (user_id, coins_balance, diamonds_balance, reward_points_balance)
       VALUES ($1, 0, 0, 0)`,
      [userId],
    );

    await client.query('COMMIT');
    console.log(`Created admin user: ${ADMIN_EMAIL}`);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Admin seed failed:', err.message);
  process.exit(1);
});
