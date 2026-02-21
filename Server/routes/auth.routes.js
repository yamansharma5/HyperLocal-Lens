// Auth routes
import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/me — Get current user info (protected)
router.get("/me", protect, getMe);

export default router;