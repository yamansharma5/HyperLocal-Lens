// Business routes
import express from "express";
import {
  registerBusiness,
  getNearbyBusinesses,
  getMyBusiness,
} from "../controllers/business.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeBusiness } from "../middlewares/role.middleware.js";

const router = express.Router();

// POST /api/business/register — Register a new business (business role only)
router.post("/register", protect, authorizeBusiness, registerBusiness);

// GET /api/business/nearby?lat=...&lng=... — Get nearby businesses
router.get("/nearby", getNearbyBusinesses);

// GET /api/business/my — Get my business (protected, business role)
router.get("/my", protect, authorizeBusiness, getMyBusiness);

export default router;