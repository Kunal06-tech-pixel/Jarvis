import { Router } from 'express';
import multer from 'multer';
import os from 'os';
import path from 'path';
import { assistantController } from '../controllers/assistantController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Store temporary audio files in OS temp dir
const upload = multer({ dest: os.tmpdir() });

router.use(authenticate);

// Endpoint expects either a file named 'audio' or a JSON body with 'command'
router.post('/command', upload.single('audio'), assistantController.handleCommand);

export default router;
