import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Express API CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-project', (projectId) => {
    socket.join(projectId);
  });

  socket.on('leave-project', (projectId) => {
    socket.leave(projectId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect DB and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`TaskFlow API running on port ${PORT}`);
  });
});