// Broadcast routes
import express from "express";
import {
  createBroadcast,
  getNearbyBroadcasts,
  getMyBroadcasts,
} from "../controllers/broadcast.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeBusiness } from "../middlewares/role.middleware.js";

const router = express.Router();

// POST /api/broadcast/create — Create a broadcast (business role only)
router.post("/create", protect, authorizeBusiness, createBroadcast);

// GET /api/broadcast/nearby?lat=...&lng=... — Get nearby active broadcasts
router.get("/nearby", getNearbyBroadcasts);

// GET /api/broadcast/my — Get my broadcasts (business role only)
router.get("/my", protect, authorizeBusiness, getMyBroadcasts);

export default router;