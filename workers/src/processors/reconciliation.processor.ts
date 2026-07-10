import { Pool } from 'pg';
import type { Job } from 'bullmq';

const pool = new Pool({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  user: process.env.DATABASE_USER ?? 'earn4u',
  password: process.env.DATABASE_PASSWORD ?? 'earn4u_secret',
  database: process.env.DATABASE_NAME ?? 'earn4u_db',
});

export async function processWalletReconciliationJob(job: Job): Promise<void> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT w.id, w.user_id, w.coins_balance, w.diamonds_balance,
        COALESCE(SUM(CASE WHEN t.type = 'credit' AND t.currency = 'coins' THEN t.amount
                          WHEN t.type = 'debit' AND t.currency = 'coins' THEN -t.amount
                          ELSE 0 END), 0) AS ledger_coins,
        COALESCE(SUM(CASE WHEN t.type = 'credit' AND t.currency = 'diamonds' THEN t.amount
                          WHEN t.type = 'debit' AND t.currency = 'diamonds' THEN -t.amount
                          ELSE 0 END), 0) AS ledger_diamonds
      FROM economy.wallets w
      LEFT JOIN economy.transactions t ON t.wallet_id = w.id
      GROUP BY w.id, w.user_id, w.coins_balance, w.diamonds_balance
      HAVING w.coins_balance != COALESCE(SUM(CASE WHEN t.type = 'credit' AND t.currency = 'coins' THEN t.amount
                                                   WHEN t.type = 'debit' AND t.currency = 'coins' THEN -t.amount ELSE 0 END), 0)
          OR w.diamonds_balance != COALESCE(SUM(CASE WHEN t.type = 'credit' AND t.currency = 'diamonds' THEN t.amount
                                                     WHEN t.type = 'debit' AND t.currency = 'diamonds' THEN -t.amount ELSE 0 END), 0)
    `);

    if (result.rows.length > 0) {
      console.error(JSON.stringify({
        level: 'error',
        msg: 'Wallet reconciliation mismatch detected',
        count: result.rows.length,
        wallets: result.rows.map((r: { user_id: string }) => r.user_id),
        jobId: job.id,
      }));
      throw new Error(`Wallet reconciliation failed: ${result.rows.length} mismatches`);
    }

    console.log(JSON.stringify({
      level: 'info',
      msg: 'Wallet reconciliation passed',
      jobId: job.id,
    }));
  } finally {
    client.release();
  }
}
