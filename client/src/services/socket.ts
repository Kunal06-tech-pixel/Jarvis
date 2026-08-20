import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token: string): Socket => {
  if (socket) {
    socket.disconnect();
  }

  // Uses the same URL base as your API, extracting root domain for Socket.IO
  const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const socketUrl = serverUrl.replace(/\/api\/?$/, '');

  socket = io(socketUrl, {
    auth: {
      token
    }
  });

  socket.on('connect', () => {
    console.log('Connected to real-time events');
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

