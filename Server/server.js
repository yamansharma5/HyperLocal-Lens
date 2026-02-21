// Server entry point
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { setIO } from "./controllers/broadcast.controller.js";
import { setChatIO } from "./controllers/chat.controller.js";
import { startBroadcastCleanup } from "./jobs/expireBroadcast.job.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// 🔥 Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

// Pass io instance to controllers
setIO(io);
setChatIO(io);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("⚡ User Connected:", socket.id);

  // 👤 Join user-specific room (for chat notifications)
  socket.on("joinUserRoom", (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`👤 Socket ${socket.id} joined user room: user_${userId}`);
    }
  });

  // 💬 Join/leave chat rooms
  socket.on("joinChat", (chatId) => {
    if (chatId) {
      socket.join(`chat_${chatId}`);
      console.log(`💬 Socket ${socket.id} joined chat: chat_${chatId}`);
    }
  });

  socket.on("leaveChat", (chatId) => {
    if (chatId) {
      socket.leave(`chat_${chatId}`);
      console.log(`🚪 Socket ${socket.id} left chat: chat_${chatId}`);
    }
  });

  // ⌨️ Typing indicators
  socket.on("typing", ({ chatId, userName }) => {
    socket.to(`chat_${chatId}`).emit("userTyping", { chatId, userName });
  });

  socket.on("stopTyping", ({ chatId }) => {
    socket.to(`chat_${chatId}`).emit("userStoppedTyping", { chatId });
  });

  // 🌍 Geo-room joining (future upgrade structure)
  socket.on("joinGeoRoom", (data) => {
    const { lat, lng } = data;
    const roomKey = `geo_${Math.round(lat * 10)}_${Math.round(lng * 10)}`;
    socket.join(roomKey);
    console.log(`📍 Socket ${socket.id} joined room: ${roomKey}`);
  });

  socket.on("leaveGeoRoom", (data) => {
    const { lat, lng } = data;
    const roomKey = `geo_${Math.round(lat * 10)}_${Math.round(lng * 10)}`;
    socket.leave(roomKey);
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });
});

// Start broadcast cleanup job (every 10 minutes)
startBroadcastCleanup();

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for connections`);
  console.log(`💬 Chat system active`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});