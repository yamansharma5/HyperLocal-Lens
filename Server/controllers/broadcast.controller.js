// Broadcast controller
import Broadcast from "../models/broadcast.model.js";
import Business from "../models/business.model.js";
import { buildNearQuery, parseGeoPoint } from "../utils/geoQuery.js";

// We'll import io dynamically to avoid circular dependency
let io;
export const setIO = (ioInstance) => {
  io = ioInstance;
};

const BROADCAST_CATEGORIES = ["Offer", "Community"];
const DEFAULT_EXPIRY_HOURS = 24;
const MAX_EXPIRY_HOURS = 168;

const parseExpiryHours = (value) => {
  if (value === undefined || value === null || value === "") {
    return DEFAULT_EXPIRY_HOURS;
  }

  const hours = Number(value);
  if (!Number.isInteger(hours) || hours < 1 || hours > MAX_EXPIRY_HOURS) {
    return null;
  }

  return hours;
};

// Create Broadcast
export const createBroadcast = async (req, res) => {
  try {
    const { message, category, expiresInHours } = req.body;
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    if (!trimmedMessage) {
      return res.status(400).json({
        success: false,
        message: "Broadcast message is required",
      });
    }

    if (trimmedMessage.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Broadcast message cannot exceed 500 characters",
      });
    }

    if (category && !BROADCAST_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${BROADCAST_CATEGORIES.join(", ")}`,
      });
    }

    const hours = parseExpiryHours(expiresInHours);
    if (!hours) {
      return res.status(400).json({
        success: false,
        message: `expiresInHours must be an integer between 1 and ${MAX_EXPIRY_HOURS}`,
      });
    }

    // Find business owned by logged-in user
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found for this user. Register a business first.",
      });
    }

    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    const broadcast = await Broadcast.create({
      business: business._id,
      message: trimmedMessage,
      category: category || "Offer",
      expiresAt,
    });

    // Populate business info for the response
    const populatedBroadcast = await Broadcast.findById(broadcast._id).populate(
      "business",
      "shopName category address location"
    );

    // Emit real-time Socket.IO event
    if (io) {
      io.emit("newBroadcast", {
        broadcast: populatedBroadcast,
        businessName: business.shopName,
        businessCategory: business.category,
        businessLocation: business.location,
      });
      console.log("Broadcast emitted via Socket.IO:", trimmedMessage.substring(0, 50));
    }

    res.status(201).json({
      success: true,
      message: "Broadcast created successfully",
      broadcast: populatedBroadcast,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Nearby Active Broadcasts (within 5km, not expired)
export const getNearbyBroadcasts = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const geoPoint = parseGeoPoint(lat, lng);

    if (!geoPoint) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be between -90 and 90, and longitude must be between -180 and 180",
      });
    }

    // Step 1: Find nearby businesses within 5km
    const nearQuery = buildNearQuery(geoPoint.lng, geoPoint.lat, 5000);
    const nearbyBusinesses = await Business.find(nearQuery);
    const businessIds = nearbyBusinesses.map((b) => b._id);

    // Step 2: Find active (non-expired) broadcasts from those businesses
    const broadcasts = await Broadcast.find({
      business: { $in: businessIds },
      expiresAt: { $gt: new Date() },
    })
      .populate("business", "shopName category address location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: broadcasts.length,
      broadcasts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Broadcasts (for business dashboard)
export const getMyBroadcasts = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "No business found for this account",
      });
    }

    const broadcasts = await Broadcast.find({
      business: business._id,
    })
      .populate("business", "shopName category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: broadcasts.length,
      broadcasts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
