// Business controller
import Business from "../models/business.model.js";
import { buildNearQuery, parseGeoPoint } from "../utils/geoQuery.js";

const coordinateErrorMessage =
  "Latitude must be between -90 and 90, and longitude must be between -180 and 180";

const hasValue = (value) => value !== undefined && value !== null && value !== "";

// Register Business
export const registerBusiness = async (req, res) => {
  try {
    const { shopName, category, address, lat, lng } = req.body;

    if (!shopName || !category || !address || !hasValue(lat) || !hasValue(lng)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (shopName, category, address, lat, lng)",
      });
    }

    const geoPoint = parseGeoPoint(lat, lng);
    if (!geoPoint) {
      return res.status(400).json({
        success: false,
        message: coordinateErrorMessage,
      });
    }

    // Check if business already exists for this owner
    const existing = await Business.findOne({ owner: req.user._id });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Business already registered for this account",
      });
    }

    const business = await Business.create({
      owner: req.user._id,
      shopName,
      category,
      address,
      location: {
        type: "Point",
        coordinates: [geoPoint.lng, geoPoint.lat],
      },
    });

    res.status(201).json({
      success: true,
      message: "Business registered successfully",
      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Nearby Businesses (within 5km)
export const getNearbyBusinesses = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!hasValue(lat) || !hasValue(lng)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const geoPoint = parseGeoPoint(lat, lng);
    if (!geoPoint) {
      return res.status(400).json({
        success: false,
        message: coordinateErrorMessage,
      });
    }

    const nearQuery = buildNearQuery(geoPoint.lng, geoPoint.lat, 5000); // 5km radius

    const businesses = await Business.find(nearQuery).populate(
      "owner",
      "name email"
    );

    res.status(200).json({
      success: true,
      count: businesses.length,
      businesses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Business (for business dashboard)
export const getMyBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "No business found for this account",
      });
    }

    res.status(200).json({
      success: true,
      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
