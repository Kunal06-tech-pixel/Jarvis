import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

export const analyticsController = {
  async getDashboardStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

      const now = new Date();
      
      // Calculate start of day 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const [
        pendingTasksCount,
        activeRemindersCount,
        upcomingEventsCount,
        completedTasksLast7Days
      ] = await Promise.all([
        // 1. Pending tasks
        prisma.task.count({
          where: { userId, status: { not: 'COMPLETED' } }
        }),
        // 2. Active Reminders waiting to trigger
        prisma.reminder.count({
          where: { userId, status: 'ACTIVE', remindAt: { gte: now } }
        }),
        // 3. Upcoming Events (starting in the future)
        prisma.event.count({
          where: { userId, status: 'CONFIRMED', startTime: { gte: now } }
        }),
        // 4. Tasks completed in the last 7 days
        prisma.task.findMany({
          where: { 
            userId, 
            status: 'COMPLETED',
            completedAt: { gte: sevenDaysAgo }
          },
          select: { completedAt: true }
        })
      ]);

      // Process the completed tasks into a daily format for the chart
      // Generate array of last 7 dates
      const activityData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateString = d.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Count how many completed tasks fall on this date
        const count = completedTasksLast7Days.filter(t => {
          if (!t.completedAt) return false;
          return t.completedAt.toISOString().split('T')[0] === dateString;
        }).length;

        // Formatter for UI (e.g. "Mon", "Tue")
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

        activityData.push({
          date: dateString,
          name: dayName,
          completed: count,
        });
      }

      res.json({
        data: {
          pendingTasks: pendingTasksCount,
          activeReminders: activeRemindersCount,
          upcomingEvents: upcomingEventsCount,
          activityChart: activityData
        }
      });

    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: { message: 'Failed to fetch analytics' } });
    }
  }
};
