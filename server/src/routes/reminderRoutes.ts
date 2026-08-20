import { Router } from 'express';
import { reminderController } from '../controllers/reminderController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', reminderController.getReminders);
router.post('/', reminderController.createReminder);
router.delete('/:id', reminderController.deleteReminder);

export default router;
