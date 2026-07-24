const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const swapRoutes = require('./routes/swapRoutes');
const chatRoutes = require('./routes/chatRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SideQuest API & Socket Server Running 🚀' });
});

// Socket.io Real-Time Event Handlers
const activeUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Register User Socket
  socket.on('register_user', (userId) => {
    if (!userId) return;
    activeUsers.set(userId, socket.id);
    socket.join(userId);
    console.log(`👤 User registered on Socket: ${userId} (${socket.id})`);
    io.emit('user_status_changed', { userId, isOnline: true });
  });

  // Join Chat Room
  socket.on('join_chat', ({ currentUserId, partnerId }) => {
    const roomId = [currentUserId, partnerId].sort().join('_');
    socket.join(roomId);
    console.log(`💬 Socket ${socket.id} joined room: ${roomId}`);
  });

  // Real-time Chat Message
  socket.on('send_message', (messageData) => {
    const { sender, receiver, content, attachments } = messageData;
    const roomId = [sender, receiver].sort().join('_');

    // Broadcast to room
    io.to(roomId).emit('receive_message', messageData);

    // Send direct notification to receiver if connected
    const receiverSocketId = activeUsers.get(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('new_notification', {
        type: 'Message',
        title: 'New Message',
        message: content ? content.slice(0, 50) : 'Sent an attachment',
        sender
      });
    }
  });

  // Typing Indicators
  socket.on('typing', ({ sender, receiver }) => {
    const roomId = [sender, receiver].sort().join('_');
    socket.to(roomId).emit('user_typing', { sender });
  });

  socket.on('stop_typing', ({ sender, receiver }) => {
    const roomId = [sender, receiver].sort().join('_');
    socket.to(roomId).emit('user_stop_typing', { sender });
  });

  // Disconnect
  socket.on('disconnect', () => {
    let disconnectedUserId = null;
    for (const [userId, sId] of activeUsers.entries()) {
      if (sId === socket.id) {
        disconnectedUserId = userId;
        activeUsers.delete(userId);
        break;
      }
    }
    if (disconnectedUserId) {
      io.emit('user_status_changed', { userId: disconnectedUserId, isOnline: false });
    }
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✨ SideQuest Server running on http://localhost:${PORT}`);
});
