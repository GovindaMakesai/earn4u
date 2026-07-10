import type { Job } from 'bullmq';

interface NotificationJobData {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function processNotificationJob(job: Job<NotificationJobData>): Promise<void> {
  const { userId, type, title, body } = job.data;
  // FCM integration wired in Phase 10
  console.log(JSON.stringify({
    level: 'info',
    msg: 'Notification queued for delivery',
    userId,
    type,
    title,
    body,
    jobId: job.id,
  }));
}
