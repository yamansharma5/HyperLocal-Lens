// Broadcast model
import mongoose from "mongoose";

const broadcastSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true
    },
    message: {
      type: String,
      maxlength: 500
    },
    media: {
      type: {
        type: String,
        enum: ["image", "video", "none"],
        default: "none"
      },
      url: {
        type: String
      }
    },
    category: {
      type: String,
      enum: ["Offer", "Community"],
      default: "Offer"
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Broadcast", broadcastSchema);
