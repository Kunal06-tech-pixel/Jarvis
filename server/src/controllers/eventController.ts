import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  location: z.string().optional().nullable(),
});

export const eventController = {
  async getEvents(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const events = await prisma.event.findMany({
        where: { userId },
        orderBy: { startTime: 'asc' },
      });

      res.json({ data: events });
    } catch (error) {
      res.status(500).json({ error: { message: 'Failed to fetch events' } });
    }
  },

  async createEvent(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const data = eventSchema.parse(req.body);

      const event = await prisma.event.create({
        data: {
          ...data,
          userId,
        },
      });

      res.status(201).json({ data: event });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
      }
      res.status(500).json({ error: { message: 'Failed to create event' } });
    }
  },

  async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const event = await prisma.event.findUnique({ where: { id } });
      if (!event || event.userId !== userId) {
        return res.status(404).json({ error: { message: 'Event not found' } });
      }

      await prisma.event.delete({ where: { id } });

      res.json({ data: { success: true } });
    } catch (error) {
      res.status(500).json({ error: { message: 'Failed to delete event' } });
    }
  },
};
