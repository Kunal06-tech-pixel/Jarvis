import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from '../db/prisma';
import { emitToUser, isUserConnected } from './socket';
import { sendPushNotificationToUser } from './pushNotification';
import { sendReminderFallbackEmail } from './emailService';
import { sendTelegramReminder } from './telegramService';

const redisUrl = process.env.REDIS_URL || (process.env.REDIS_HOST ? `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}` : 'redis://127.0.0.1:6379');
const isTls = redisUrl.startsWith('rediss://');
const redisOptions: any = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};
if (isTls) {
  redisOptions.tls = { rejectUnauthorized: false };
}

// Dedicated connections for Queue and Worker as per BullMQ requirements
const queueConnection = new Redis(redisUrl, redisOptions);
const workerConnection = new Redis(redisUrl, redisOptions);

queueConnection.on('error', (err) => {
  console.warn('[BullMQ Redis Queue Error]:', err.message);
});

workerConnection.on('error', (err) => {
  console.warn('[BullMQ Redis Worker Error]:', err.message);
});

export const reminderQueue = new Queue('reminders', { connection: queueConnection });

export const getReminderJobId = (reminderId: string) => `reminder-${reminderId}`;

/**
 * Schedule or re-schedule a BullMQ delayed job for a specific reminder
 */
export const scheduleReminderJob = async (reminder: { id: string; remindAt: Date | string; status?: string }) => {
  const jobId = getReminderJobId(reminder.id);
  
  try {
    // Remove existing job if any
    await cancelReminderJob(reminder.id);

    // If status is provided and not ACTIVE, do not schedule
    if (reminder.status && reminder.status !== 'ACTIVE') {
      return;
    }

    const remindTime = new Date(reminder.remindAt).getTime();
    const now = Date.now();
    const delay = Math.max(0, remindTime - now);

    await reminderQueue.add(
      'execute-reminder',
      { reminderId: reminder.id },
      {
        delay,
        jobId,
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    console.log(`[BullMQ] Scheduled exact reminder ${reminder.id} with delay ${delay}ms (${new Date(remindTime).toISOString()})`);
  } catch (error) {
    console.error(`[BullMQ] Failed to schedule reminder ${reminder.id}:`, error);
  }
};

/**
 * Cancel an existing scheduled reminder job
 */
export const cancelReminderJob = async (reminderId: string) => {
  const jobId = getReminderJobId(reminderId);
  try {
    const existingJob = await reminderQueue.getJob(jobId);
    if (existingJob) {
      await existingJob.remove();
      console.log(`[BullMQ] Removed scheduled job ${jobId}`);
    }
  } catch (error) {
    console.error(`[BullMQ] Error cancelling job for reminder ${reminderId}:`, error);
  }
};

/**
 * Process a single reminder when its exact scheduled time fires
 */
export const processSingleReminder = async (reminderId: string) => {
  const now = new Date();

  try {
    const reminder = await prisma.reminder.findUnique({
      where: { id: reminderId },
      include: {
        user: {
          include: {
            preferences: true,
          },
        },
      },
    });

    if (!reminder || reminder.status !== 'ACTIVE') {
      console.log(`[BullMQ] Reminder ${reminderId} is no longer active or was deleted. Skipping.`);
      return;
    }

    // 1. Emit real-time Socket.IO event to connected user tab
    emitToUser(reminder.userId, 'reminder:due', {
      id: reminder.id,
      title: reminder.title,
      description: reminder.description,
      remindAt: reminder.remindAt,
    });
    console.log(`[BullMQ] Fired real-time socket reminder ${reminder.id} ("${reminder.title}") for user ${reminder.userId}`);

    // 2. Dispatch device-level Web Push notification (for closed/backgrounded tabs and devices)
    try {
      const isOnline = isUserConnected(reminder.userId);
      console.log(`[BullMQ] User ${reminder.userId} live socket status: ${isOnline ? 'ONLINE (Tab Active)' : 'OFFLINE (Tab Closed/Backgrounded)'}`);
      
      const pushResult = await sendPushNotificationToUser(reminder.userId, {
        title: 'JARVIS Reminder',
        body: reminder.title,
        url: '/reminders',
        tag: `reminder-${reminder.id}`,
        data: {
          reminderId: reminder.id,
          remindAt: reminder.remindAt,
        },
      });

      console.log(`[BullMQ] Web Push result for reminder ${reminder.id}: ${pushResult.sent} delivered, ${pushResult.failed} failed.`);

      // 3. Reliability Fallback: If push delivery failed for all devices (or 0 subscriptions registered), fall back to email
      if (pushResult.sent === 0 && reminder.user?.email) {
        console.log(`[BullMQ] Web Push reached 0 devices for user ${reminder.userId}. Initiating email fallback to ${reminder.user.email}...`);
        await sendReminderFallbackEmail(reminder.user, reminder);
      }
    } catch (pushErr) {
      console.error(`[BullMQ] Error in push notification pipeline for reminder ${reminder.id}:`, pushErr);
      if (reminder.user?.email) {
        await sendReminderFallbackEmail(reminder.user, reminder).catch(() => {});
      }
    }

    // 4. Dispatch Telegram Phone Alert (if user has enabled Telegram integration)
    const userPrefs = reminder.user?.preferences;
    if (userPrefs?.telegramEnabled && userPrefs?.telegramChatId) {
      try {
        console.log(`[BullMQ] Dispatching Telegram phone alert to Chat ID ${userPrefs.telegramChatId}...`);
        const tgRes = await sendTelegramReminder(userPrefs.telegramChatId, reminder);
        console.log(`[BullMQ] Telegram notification result: ${tgRes.success ? 'DELIVERED ✅' : 'FAILED (' + tgRes.error + ') ❌'}`);
      } catch (tgErr) {
        console.error(`[BullMQ] Error dispatching Telegram alert for reminder ${reminder.id}:`, tgErr);
      }
    }

    // 5. Persist in-app Notification record
    try {
      await prisma.notification.create({
        data: {
          userId: reminder.userId,
          type: 'REMINDER',
          title: 'Reminder Due',
          body: reminder.title,
          data: {
            reminderId: reminder.id,
            remindAt: reminder.remindAt,
          },
        },
      });
    } catch (notifErr) {
      console.error(`[BullMQ] Failed to persist notification record for reminder ${reminder.id}:`, notifErr);
    }

    // 3. Handle recurrence or mark as COMPLETED
    if (reminder.recurrence) {
      const nextTime = calculateNextRecurrence(reminder.remindAt, reminder.recurrence);
      const updated = await prisma.reminder.update({
        where: { id: reminder.id },
        data: {
          remindAt: nextTime,
          lastTriggered: now,
          nextTrigger: nextTime,
        },
      });
      // Schedule the next recurrent occurrence in BullMQ
      await scheduleReminderJob(updated);
      console.log(`[BullMQ] Recurring reminder ${reminder.id} rescheduled for ${nextTime.toISOString()}`);
    } else {
      await prisma.reminder.update({
        where: { id: reminder.id },
        data: {
          status: 'COMPLETED',
          lastTriggered: now,
        },
      });
      console.log(`[BullMQ] Reminder ${reminder.id} marked as COMPLETED`);
    }
  } catch (error) {
    console.error(`[BullMQ] Error processing reminder ${reminderId}:`, error);
  }
};

/**
 * Low-frequency safety net sweep (runs every 10 mins) to catch any unhandled due reminders
 */
export const processDueRemindersSafetyNet = async () => {
  const now = new Date();
  try {
    const dueReminders = await prisma.reminder.findMany({
      where: {
        status: 'ACTIVE',
        remindAt: {
          lte: now,
        },
      },
    });

    if (dueReminders.length > 0) {
      console.log(`[Safety Net] Found ${dueReminders.length} overdue active reminder(s). Processing...`);
      for (const reminder of dueReminders) {
        await processSingleReminder(reminder.id);
      }
    }
  } catch (error) {
    console.error('[Safety Net] Error during safety sweep:', error);
  }
};

/**
 * Startup reconciliation step: ensures all ACTIVE reminders in DB have matching BullMQ jobs
 */
export const reconcileScheduledReminders = async () => {
  console.log('🔄 Reconciling active reminders with BullMQ queue on startup...');
  const now = new Date();

  try {
    const activeReminders = await prisma.reminder.findMany({
      where: { status: 'ACTIVE' },
    });

    let scheduledCount = 0;
    let overdueCount = 0;

    for (const reminder of activeReminders) {
      const remindTime = new Date(reminder.remindAt).getTime();
      if (remindTime <= now.getTime()) {
        // Due while server was offline
        console.log(`[Reconciliation] Processing overdue reminder: ${reminder.id} ("${reminder.title}")`);
        await processSingleReminder(reminder.id);
        overdueCount++;
      } else {
        // Future reminder: ensure job is in BullMQ
        await scheduleReminderJob(reminder);
        scheduledCount++;
      }
    }

    console.log(`✅ Reconciliation finished: ${scheduledCount} future reminders scheduled, ${overdueCount} overdue reminders processed.`);
  } catch (error) {
    console.error('❌ Error during startup reconciliation:', error);
  }
};

/**
 * Initialize BullMQ Worker, Safety Net Job, and run Startup Reconciliation
 */
export const initWorker = async () => {
  console.log('⚙️ Initializing BullMQ Worker for Reminders...');

  // Setup low-frequency safety-net repeatable job (every 10 minutes)
  await reminderQueue.add(
    'safety-net-reminder-sweep',
    {},
    {
      repeat: {
        pattern: '*/10 * * * *',
      },
      jobId: 'system-safety-net-sweep',
    }
  );

  const worker = new Worker(
    'reminders',
    async (job: Job) => {
      if (job.name === 'execute-reminder') {
        const { reminderId } = job.data;
        if (reminderId) {
          await processSingleReminder(reminderId);
        }
      } else if (job.name === 'safety-net-reminder-sweep') {
        await processDueRemindersSafetyNet();
      }
    },
    { connection: workerConnection }
  );

  worker.on('completed', (job: Job) => {
    console.log(`[BullMQ] Job ${job.id} (${job.name}) completed.`);
  });

  worker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`[BullMQ] Job ${job?.id} (${job?.name}) failed: ${err.message}`);
  });

  // Run startup reconciliation
  await reconcileScheduledReminders();
};

const calculateNextRecurrence = (currentDate: Date, pattern: string): Date => {
  const next = new Date(currentDate);
  const p = pattern.toLowerCase();

  if (p.includes('daily') || p.includes('every day')) {
    next.setDate(next.getDate() + 1);
  } else if (p.includes('weekly') || p.includes('week')) {
    next.setDate(next.getDate() + 7);
  } else if (p.includes('monthly') || p.includes('month')) {
    next.setMonth(next.getMonth() + 1);
  } else {
    // fallback default to daily if unparsable
    next.setDate(next.getDate() + 1);
  }

  return next;
};
