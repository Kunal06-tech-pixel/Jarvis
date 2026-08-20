import { Router } from 'express';
import { telegramController } from '../controllers/telegramController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/status', telegramController.getStatus);
router.post('/settings', telegramController.updateSettings);
router.post('/test', telegramController.sendTest);

export default router;
