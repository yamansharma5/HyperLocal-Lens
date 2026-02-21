// Chat controller
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import Business from "../models/business.model.js";

let io;
export const setChatIO = (socketIO) => {
    io = socketIO;
};

// Start or get existing chat with a business
export const startChat = async (req, res) => {
    try {
        const { businessId } = req.body;
        const userId = req.user._id;

        if (!businessId) {
            return res.status(400).json({ success: false, message: "Business ID is required" });
        }

        const business = await Business.findById(businessId);
        if (!business) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }

        if (business.owner.toString() === userId.toString()) {
            return res.status(400).json({ success: false, message: "Cannot chat with your own business" });
        }

        // Check if chat already exists
        let chat = await Chat.findOne({
            business: businessId,
            participants: { $all: [userId, business.owner] },
        })
            .populate("participants", "name email role")
            .populate("business", "shopName category address");

        if (chat) {
            return res.status(200).json({ success: true, chat });
        }

        // Create new chat
        chat = await Chat.create({
            participants: [userId, business.owner],
            business: businessId,
            lastMessage: { text: "", senderId: userId, createdAt: new Date() },// Initialize unread counts for both participants
            unreadCount: new Map([
                [userId.toString(), 0],
                [business.owner.toString(), 0],
            ]),
        });

        chat = await Chat.findById(chat._id)
            .populate("participants", "name email role")
            .populate("business", "shopName category address");

        res.status(201).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all chats for current user
export const getMyChats = async (req, res) => {
    try {
        const chats = await Chat.find({ participants: req.user._id })
            .populate("participants", "name email role")
            .populate("business", "shopName category address")
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, count: chats.length, chats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get messages for a chat
export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findOne({ _id: chatId, participants: req.user._id });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        const messages = await Message.find({ chatId })
            .sort({ createdAt: -1 })
            .limit(100)
            .populate("senderId", "name role");

        // Reset unread count
        chat.unreadCount.set(req.user._id.toString(), 0);
        await chat.save();

        res.status(200).json({ success: true, messages: messages.reverse() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { chatId, text } = req.body;
        const senderId = req.user._id;

        if (!chatId || !text?.trim()) {
            return res.status(400).json({ success: false, message: "Chat ID and text are required" });
        }

        const chat = await Chat.findOne({ _id: chatId, participants: senderId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        const message = await Message.create({ chatId, senderId, text: text.trim() });

        // Update lastMessage + unread counts
        chat.lastMessage = { text: text.trim(), senderId, createdAt: new Date() };
        chat.participants.forEach((pid) => {
            if (pid.toString() !== senderId.toString()) {
                const current = chat.unreadCount.get(pid.toString()) || 0;
                chat.unreadCount.set(pid.toString(), current + 1);
            }
        });
        chat.updatedAt = new Date();
        await chat.save();

        const populated = await Message.findById(message._id).populate("senderId", "name role");

        // Emit real-time
        if (io) {
            io.to(`chat_${chatId}`).emit("newMessage", { chatId, message: populated });
            chat.participants.forEach((pid) => {
                io.to(`user_${pid.toString()}`).emit("chatUpdated", {
                    chatId,
                    lastMessage: chat.lastMessage,
                    unreadCount: chat.unreadCount.get(pid.toString()) || 0,
                });
            });
        }

        res.status(201).json({ success: true, message: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark chat as read
export const markAsRead = async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.chatId, participants: req.user._id });
        if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });

        chat.unreadCount.set(req.user._id.toString(), 0);
        await chat.save();

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a chat and all its messages
export const deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.chatId, participants: req.user._id });
        if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });

        // Delete all messages in this chat
        await Message.deleteMany({ chatId: chat._id });

        // Delete the chat itself
        await Chat.findByIdAndDelete(chat._id);

        res.status(200).json({ success: true, message: "Chat deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
