// Server entry point
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { setIO } from "./controllers/broadcast.controller.js";
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

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("⚡ User Connected:", socket.id);

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
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});