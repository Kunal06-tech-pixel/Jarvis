import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

export const taskController = {
  async getTasks(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const tasks = await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ data: tasks });
    } catch (error) {
      console.error('getTasks error:', error);
      res.status(500).json({ error: { message: 'Failed to fetch tasks' } });
    }
  },

  async getTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const task = await prisma.task.findUnique({
        where: { id },
      });

      if (!task || task.userId !== userId) {
        return res.status(404).json({ error: { message: 'Task not found' } });
      }

      res.json({ data: task });
    } catch (error) {
      res.status(500).json({ error: { message: 'Failed to fetch task' } });
    }
  },

  async createTask(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const data = taskSchema.parse(req.body);

      const task = await prisma.task.create({
        data: {
          ...data,
          userId,
        },
      });

      res.status(201).json({ data: task });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
      }
      res.status(500).json({ error: { message: 'Failed to create task' } });
    }
  },

  async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const task = await prisma.task.findUnique({ where: { id } });
      if (!task || task.userId !== userId) {
        return res.status(404).json({ error: { message: 'Task not found' } });
      }

      const data = taskSchema.partial().parse(req.body);

      // Automatically manage completedAt on status transitions
      const updateData: any = { ...data };
      if (data.status === 'COMPLETED' && task.status !== 'COMPLETED') {
        updateData.completedAt = new Date();
      } else if (data.status && data.status !== 'COMPLETED' && task.status === 'COMPLETED') {
        updateData.completedAt = null;
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: updateData,
      });

      res.json({ data: updatedTask });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
      }
      res.status(500).json({ error: { message: 'Failed to update task' } });
    }
  },

  async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const task = await prisma.task.findUnique({ where: { id } });
      if (!task || task.userId !== userId) {
        return res.status(404).json({ error: { message: 'Task not found' } });
      }

      await prisma.task.delete({ where: { id } });

      res.json({ data: { success: true } });
    } catch (error) {
      res.status(500).json({ error: { message: 'Failed to delete task' } });
    }
  },
};
