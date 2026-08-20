import { Router } from 'express';
import authRoutes from './authRoutes';
import taskRoutes from './taskRoutes';
import reminderRoutes from './reminderRoutes';
import eventRoutes from './eventRoutes';
import assistantRoutes from './assistantRoutes';
import analyticsRoutes from './analyticsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/reminders', reminderRoutes);
router.use('/events', eventRoutes);
router.use('/assistant', assistantRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
