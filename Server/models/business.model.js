// Business model
import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    shopName: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: [
        "Event",
        "Kirana",
        "Medical",
        "Restaurant",
        "Hardware",
        "Salon",
        "Other"
      ],
      required: true
    },
    address: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Geospatial index
businessSchema.index({ location: "2dsphere" });// it means that the location field will be indexed as a 2D sphere, allowing for efficient geospatial queries like finding nearby businesses or calculating distances between points.

export default mongoose.model("Business", businessSchema);
