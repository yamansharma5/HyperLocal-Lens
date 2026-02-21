// Express app setup
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import businessRoutes from "./routes/business.routes.js";
import broadcastRoutes from "./routes/broadcast.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hyperlocal Lens API is running",
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/broadcast", broadcastRoutes);
app.use("/api/chat", chatRoutes);

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// Global error handler
app.use(errorMiddleware);

export default app;