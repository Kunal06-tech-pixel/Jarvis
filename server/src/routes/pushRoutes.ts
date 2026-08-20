import { Router } from 'express';
import { pushController } from '../controllers/pushController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public route to fetch public VAPID key
router.get('/public-key', pushController.getPublicKey);

// Authenticated routes
router.use(authenticate);
router.post('/subscribe', pushController.subscribe);
router.post('/unsubscribe', pushController.unsubscribe);
router.post('/test', pushController.sendTest);

export default router;
