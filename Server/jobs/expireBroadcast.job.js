// Broadcast expiry cleanup job
// Runs periodically to delete expired broadcasts from the database

import Broadcast from "../models/broadcast.model.js";

/**
 * Delete all broadcasts that have expired
 */
export const cleanExpiredBroadcasts = async () => {
    try {
        const result = await Broadcast.deleteMany({
            expiresAt: { $lt: new Date() },
        });
        if (result.deletedCount > 0) {
            console.log(`🧹 Cleaned ${result.deletedCount} expired broadcast(s)`);
        }
    } catch (error) {
        console.error("❌ Broadcast cleanup failed:", error.message);
    }
};

/**
 * Start the periodic cleanup interval
 * @param {number} intervalMs - Interval in milliseconds (default: 10 minutes)
 */
export const startBroadcastCleanup = (intervalMs = 10 * 60 * 1000) => {
    // Run immediately on start
    cleanExpiredBroadcasts();
    // Then run periodically
    setInterval(cleanExpiredBroadcasts, intervalMs);
    console.log("⏰ Broadcast cleanup job started");
};
