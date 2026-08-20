import nodemailer from 'nodemailer';
import { config } from '../config';

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });
  }

  return transporter;
};

export interface EmailFallbackResult {
  sent: boolean;
  reason?: string;
  messageId?: string;
}

/**
 * Send an email notification fallback for a reminder when all Web Push subscriptions fail or are absent.
 * Strictly scoped to reminder alerts only.
 */
export const sendReminderFallbackEmail = async (
  user: { email: string; name: string },
  reminder: { id: string; title: string; description?: string | null; remindAt: Date | string }
): Promise<EmailFallbackResult> => {
  const mailer = getTransporter();

  if (!mailer) {
    console.log(`[EmailFallback] SMTP not configured in environment. Fallback email skipped for ${user.email} (Reminder: "${reminder.title}")`);
    return {
      sent: false,
      reason: 'SMTP_NOT_CONFIGURED',
    };
  }

  const formattedDate = new Date(reminder.remindAt).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A0D14; color: #FFFFFF; margin: 0; padding: 24px; }
          .card { background-color: #10141E; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; max-width: 520px; margin: 0 auto; padding: 28px; }
          .header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; }
          .badge { background: rgba(56, 189, 248, 0.15); color: #38BDF8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(56, 189, 248, 0.3); }
          .title { font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 0 0 8px 0; }
          .time { font-size: 13px; color: #94A3B8; margin-bottom: 16px; }
          .desc { font-size: 14px; color: #CBD5E1; line-height: 1.5; margin-bottom: 24px; background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 12px; }
          .footer { font-size: 11px; color: #64748B; margin-top: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="badge">JARVIS System Directive</span>
          </div>
          <h1 class="title">${reminder.title}</h1>
          <div class="time">Scheduled for: <strong>${formattedDate}</strong></div>
          ${reminder.description ? `<div class="desc">${reminder.description}</div>` : ''}
          <div class="footer">
            Delivered via JARVIS Autonomous Notification Pipeline • Reliability Fallback
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const info = await mailer.sendMail({
      from: config.SMTP_FROM,
      to: user.email,
      subject: `⏰ Reminder: ${reminder.title}`,
      text: `JARVIS Reminder Alert: ${reminder.title} scheduled for ${formattedDate}`,
      html: htmlContent,
    });

    console.log(`[EmailFallback] Successfully sent reminder email to ${user.email} (MessageId: ${info.messageId})`);
    return {
      sent: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error(`[EmailFallback] Failed to send reminder email to ${user.email}:`, error);
    return {
      sent: false,
      reason: error.message,
    };
  }
};
