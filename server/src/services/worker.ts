import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from '../db/prisma';
import { emitToUser } from './socket';

// Default redis connection for local docker-compose
const redisOptions = { maxRetriesPerRequest: null };
const connection = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', redisOptions);

export const reminderQueue = new Queue('reminders', { connection });

// Initialize the recurring job that scans the database
export const initWorker = async () => {
  console.log('Initializing BullMQ Worker for Reminders...');

  // Add a repeatable job that runs every minute to check for due reminders
  await reminderQueue.add('check-due-reminders', {}, {
    repeat: {
      pattern: '* * * * *', // every minute
    },
    jobId: 'system-reminder-scanner', // unique ID to prevent duplicates
  });

  const worker = new Worker('reminders', async (job) => {
    if (job.name === 'check-due-reminders') {
      await processDueReminders();
    }
  }, { connection });

  worker.on('completed', job => {
    // console.log(`${job.id} has completed!`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with ${err.message}`);
  });
};

const processDueReminders = async () => {
  const now = new Date();

  try {
    // Find all active reminders where remindAt is <= now
    const dueReminders = await prisma.reminder.findMany({
      where: {
        status: 'ACTIVE',
        remindAt: {
          lte: now
        }
      }
    });

    for (const reminder of dueReminders) {
      // 1. Emit real-time socket event to the user
      emitToUser(reminder.userId, 'reminder:due', {
        id: reminder.id,
        title: reminder.title,
        remindAt: reminder.remindAt,
      });
      console.log(`Fired reminder ${reminder.id} for user ${reminder.userId}`);

      // 2. Handle recurrence or mark as completed
      if (reminder.recurrence) {
        // Very basic recurrence logic for demo purposes
        // In a real production app, we'd use a cron parser or something like rrule
        const nextTime = calculateNextRecurrence(reminder.remindAt, reminder.recurrence);
        
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: {
            remindAt: nextTime,
            lastTriggered: now,
          }
        });
      } else {
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: {
            status: 'COMPLETED',
            lastTriggered: now,
          }
        });
      }
    }
  } catch (error) {
    console.error('Error processing due reminders:', error);
  }
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
