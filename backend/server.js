import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('join-project', (projectId) => socket.join(projectId));
  socket.on('leave-project', (projectId) => socket.leave(projectId));
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`TaskFlow API running on port ${PORT}`);
  });
});
