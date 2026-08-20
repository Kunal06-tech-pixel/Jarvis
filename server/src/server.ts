import http from 'http';
import app from './app';
import { config } from './config';
import { initSocket } from './services/socket';
import { initWorker } from './services/worker';

const server = http.createServer(app);

// Setup Socket.IO with authentication
const io = initSocket(server);

const PORT = config.PORT;

server.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO enabled with authentication`);
  
  // Start the background worker
  try {
    await initWorker();
    console.log(`⚙️  Background worker initialized successfully`);
  } catch (error) {
    console.error('Failed to initialize background worker:', error);
  }
});

export { io };
