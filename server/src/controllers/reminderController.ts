import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { z } from 'zod';
import { scheduleReminderJob, cancelReminderJob } from '../services/worker';

const reminderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  remindAt: z.string().datetime(),
  recurrence: z.string().optional().nullable(),
});

const reminderUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  remindAt: z.string().datetime().optional(),
  recurrence: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']).optional(),
});

export const reminderController = {
  async getReminders(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const reminders = await prisma.reminder.findMany({
        where: { userId },
        orderBy: { remindAt: 'asc' },
      });

      res.json({ data: reminders });
    } catch (error) {
      res.status(500).json({ error: { message: 'Failed to fetch reminders' } });
    }
  },

  async createReminder(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const data = reminderSchema.parse(req.body);

      const reminder = await prisma.reminder.create({
        data: {
          ...data,
          userId,
        },
      });

      // Schedule exact-time delayed BullMQ job
      await scheduleReminderJob(reminder);

      res.status(201).json({ data: reminder });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
      }
      res.status(500).json({ error: { message: 'Failed to create reminder' } });
    }
  },

  async updateReminder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const data = reminderUpdateSchema.parse(req.body);

      const existing = await prisma.reminder.findUnique({ where: { id } });
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ error: { message: 'Reminder not found' } });
      }

      const updated = await prisma.reminder.update({
        where: { id },
        data: {
          ...(data.title ? { title: data.title } : {}),
          ...(data.remindAt ? { remindAt: new Date(data.remindAt) } : {}),
          ...(data.recurrence !== undefined ? { recurrence: data.recurrence } : {}),
          ...(data.status ? { status: data.status } : {}),
        },
      });

      // Re-schedule or cancel BullMQ job depending on new state
      if (updated.status === 'ACTIVE') {
        await scheduleReminderJob(updated);
      } else {
        await cancelReminderJob(id);
      }

      res.json({ data: updated });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
      }
      res.status(500).json({ error: { message: 'Failed to update reminder' } });
    }
  },

  async deleteReminder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const reminder = await prisma.reminder.findUnique({ where: { id } });
      if (!reminder || reminder.userId !== userId) {
        return res.status(404).json({ error: { message: 'Reminder not found' } });
      }

      // Cancel any active BullMQ scheduled job first
      await cancelReminderJob(id);

      await prisma.reminder.delete({ where: { id } });

      res.json({ data: { success: true } });
    } catch (error) {
      res.status(500).json({ error: { message: 'Failed to delete reminder' } });
    }
  },
};
