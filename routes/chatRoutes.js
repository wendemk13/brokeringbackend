import express from 'express';
import { getChatMessages, sendMessage } from '../controllers/chatController.js';
import authMiddleware from '../middlewares/auth.js'; // Middleware to get req.user.id

const router = express.Router();

router.get('/chat/:userId', authMiddleware, getChatMessages);
router.post('/chat/send', authMiddleware, sendMessage);

export default router;
