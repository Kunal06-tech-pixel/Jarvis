import { Router } from 'express';
import { eventController } from '../controllers/eventController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', eventController.getEvents);
router.post('/', eventController.createEvent);
router.delete('/:id', eventController.deleteEvent);

export default router;
