import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { z } from 'zod';

const reminderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  remindAt: z.string().datetime(),
  recurrence: z.string().optional().nullable(),
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

      res.status(201).json({ data: reminder });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
      }
      res.status(500).json({ error: { message: 'Failed to create reminder' } });
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

      await prisma.reminder.delete({ where: { id } });

      res.json({ data: { success: true } });
    } catch (error) {
      res.status(500).json({ error: { message: 'Failed to delete reminder' } });
    }
  },
};
