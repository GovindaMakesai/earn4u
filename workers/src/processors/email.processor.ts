import nodemailer from 'nodemailer';
import type { Job } from 'bullmq';

interface EmailJobData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'localhost',
  port: parseInt(process.env.SMTP_PORT ?? '1025', 10),
  secure: false,
});

export async function processEmailJob(job: Job<EmailJobData>): Promise<void> {
  const { to, subject, html, text } = job.data;

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'noreply@earn4u.com',
    to,
    subject,
    html,
    text: text ?? html.replace(/<[^>]+>/g, ''),
  });
}
