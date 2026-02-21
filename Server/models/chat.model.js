// Chat model
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true,
        },
        lastMessage: {
            text: { type: String, default: "" },
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdAt: { type: Date, default: Date.now },
        },
        unreadCount: {
            type: Map,
            of: Number,
            default: {},
        },
    },
    { timestamps: true }
);

chatSchema.index({ participants: 1 });
chatSchema.index({ business: 1 });
chatSchema.index({ updatedAt: -1 });

export default mongoose.model("Chat", chatSchema);
