import express from "express";
import { processMessage } from "../controllers/chatbot.controller.js";
import optionalAuth from "../middlewares/optionalAuth.js";

const router = express.Router();

/**
 * Chatbot message endpoint
 * Uses optional authentication - works for both guests and logged-in users
 * 
 * - Without auth: Limited functionality (browse jobs only)
 * - With auth: Full functionality based on profile completion
 */
router.post("/message", optionalAuth, processMessage);

export default router;
