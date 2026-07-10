/**
 * Idempotent admin seed — creates admin@earn4u.app if missing.
 * Never blocks deploy: logs errors and exits 0.
 */
const bcrypt = require('bcrypt');
const { Client } = require('pg');

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@earn4u.app';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || 'earn4u_admin';
const ADMIN_DISPLAY_NAME = process.env.SEED_ADMIN_DISPLAY_NAME || 'Earn4U Admin';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

async function connectWithRetry(maxAttempts = 10) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const client = createClient();
    try {
      await client.connect();
      return client;
    } catch (error) {
      lastError = error;
      await client.end().catch(() => undefined);
      if (attempt === maxAttempts) break;
      const delayMs = Math.min(attempt * 3000, 15000);
      console.log(
        `Admin seed: database not ready (attempt ${attempt}/${maxAttempts})`,
      );
      await sleep(delayMs);
    }
  }

  throw lastError;
}

async function main() {
  const client = await connectWithRetry();

  try {
    const byEmail = await client.query(
      `SELECT p.id, p.role
       FROM auth.users_credentials c
       JOIN users.profiles p ON p.id = c.user_id
       WHERE c.email = $1`,
      [ADMIN_EMAIL],
    );

    if (byEmail.rows.length > 0) {
      const row = byEmail.rows[0];
      if (!['admin', 'super_admin', 'owner'].includes(row.role)) {
        await client.query(
          `UPDATE users.profiles SET role = 'admin', status = 'active' WHERE id = $1`,
          [row.id],
        );
        console.log(`Updated ${ADMIN_EMAIL} to admin role`);
      } else {
        console.log(`Admin user ${ADMIN_EMAIL} already exists — skipping`);
      }
      return;
    }

    const byUsername = await client.query(
      `SELECT id FROM users.profiles WHERE username = $1`,
      [ADMIN_USERNAME],
    );

    if (byUsername.rows.length > 0) {
      console.log(`Username ${ADMIN_USERNAME} already exists — skipping admin seed`);
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
    console.error('Admin seed warning:', error.message);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Admin seed warning:', err.message);
});
