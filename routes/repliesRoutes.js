import { getAllReplies, getFeedbackReplies, sendReply } from "../controllers/repliesController.js";
import express from "express"
const router = express.Router();


router.get('/getAll', getAllReplies);
router.get('/getAll/:id', getFeedbackReplies);
router.post('/sendreply/:feedbackid/:adminid', sendReply);

export default router;