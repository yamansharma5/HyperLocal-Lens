// Broadcast controller
import Broadcast from "../models/broadcast.model.js";
import Business from "../models/business.model.js";
import { buildNearQuery } from "../utils/geoQuery.js";

// We'll import io dynamically to avoid circular dependency
let io;
export const setIO = (ioInstance) => {
  io = ioInstance;
};

// ✅ Create Broadcast
export const createBroadcast = async (req, res) => {
  try {
    const { message, category, expiresInHours } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Broadcast message is required",
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

    const hours = parseInt(expiresInHours) || 24;
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    const broadcast = await Broadcast.create({
      business: business._id,
      message,
      category: category || "Offer",
      expiresAt,
    });

    // Populate business info for the response
    const populatedBroadcast = await Broadcast.findById(broadcast._id).populate(
      "business",
      "shopName category address location"
    );

    // 🔥 Emit real-time Socket.io event
    if (io) {
      io.emit("newBroadcast", {
        broadcast: populatedBroadcast,
        businessName: business.shopName,
        businessCategory: business.category,
        businessLocation: business.location,
      });
      console.log("📡 Broadcast emitted via Socket.io:", message.substring(0, 50));
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

// ✅ Get Nearby Active Broadcasts (within 5km, not expired)
export const getNearbyBroadcasts = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    // Step 1: Find nearby businesses within 5km
    const nearQuery = buildNearQuery(lng, lat, 5000);
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

// ✅ Get My Broadcasts (for business dashboard)
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