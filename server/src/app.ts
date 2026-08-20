import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: '*' })); // adjust in production
app.use(express.json());

import routes from './routes';

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});
app.use('/api', limiter);

app.use('/api', routes);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date() });
});

// We will add actual API routes later

// Error handler (fallback)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
