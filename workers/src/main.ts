import 'dotenv/config';
import { Worker, Queue } from 'bullmq';
import pino from 'pino';
import { createServer } from 'http';
import { Registry, collectDefaultMetrics } from 'prom-client';
import { processEmailJob } from './processors/email.processor';
import { processWalletReconciliationJob } from './processors/reconciliation.processor';
import { processNotificationJob } from './processors/notification.processor';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});

const redisConnection = {
  host: process.env.REDIS_HOST ?? 'localhost',
  port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null as null,
};

export const QUEUES = {
  EMAIL: 'earn4u-email',
  NOTIFICATIONS: 'earn4u-notifications',
  RECONCILIATION: 'earn4u-reconciliation',
} as const;

const concurrency = parseInt(process.env.WORKER_CONCURRENCY ?? '5', 10);

const emailWorker = new Worker(QUEUES.EMAIL, processEmailJob, {
  connection: redisConnection,
  concurrency,
});

const notificationWorker = new Worker(QUEUES.NOTIFICATIONS, processNotificationJob, {
  connection: redisConnection,
  concurrency,
});

const reconciliationWorker = new Worker(QUEUES.RECONCILIATION, processWalletReconciliationJob, {
  connection: redisConnection,
  concurrency: 1,
});

for (const worker of [emailWorker, notificationWorker, reconciliationWorker]) {
  worker.on('completed', (job) => {
    logger.info({ jobId: job.id, queue: job.queueName }, 'Job completed');
  });
  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, queue: job?.queueName, err: err.message }, 'Job failed');
  });
}

const registry = new Registry();
collectDefaultMetrics({ register: registry, prefix: 'earn4u_worker_' });

const metricsPort = parseInt(process.env.METRICS_PORT ?? '9091', 10);
createServer(async (req, res) => {
  if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': registry.contentType });
    res.end(await registry.metrics());
    return;
  }
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'earn4u-worker' }));
    return;
  }
  res.writeHead(404);
  res.end();
}).listen(metricsPort, () => {
  logger.info({ metricsPort, concurrency }, 'Earn4U worker started');
});

async function scheduleRecurringJobs() {
  const reconciliationQueue = new Queue(QUEUES.RECONCILIATION, { connection: redisConnection });
  await reconciliationQueue.add(
    'wallet-reconciliation',
    { type: 'daily' },
    {
      repeat: { pattern: '0 2 * * *' },
      jobId: 'daily-wallet-reconciliation',
    },
  );
  logger.info('Scheduled daily wallet reconciliation job');
}

scheduleRecurringJobs().catch((err) => {
  logger.error({ err }, 'Failed to schedule recurring jobs');
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down workers...');
  await Promise.all([
    emailWorker.close(),
    notificationWorker.close(),
    reconciliationWorker.close(),
  ]);
  process.exit(0);
});
