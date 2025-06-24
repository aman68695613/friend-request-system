import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // or specify frontend URL
    methods: ['GET', 'POST'],
  },
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

// Expose function to notify users
export const notifyUser = (userId, event, payload) => {
  const socketId = onlineUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit(event, payload);
  }
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`)
});
