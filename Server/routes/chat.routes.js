// Chat routes
import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    startChat,
    getMyChats,
    getMessages,
    sendMessage,
    markAsRead,
    deleteChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.use(protect);

router.post("/start", startChat);
router.get("/my", getMyChats);
router.get("/:chatId/messages", getMessages);
router.post("/send", sendMessage);
router.put("/:chatId/read", markAsRead);
router.delete("/:chatId", deleteChat);

export default router;

