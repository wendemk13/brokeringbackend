import { sendfeedback, getAllFeedbacks, getUserFeedbacks, getsinglefeedback } from "../controllers/feedbackcontroller.js";
import express from 'express'
const router = express.Router();

router.get('/getfeedbacks', getAllFeedbacks)
router.post('/sendfeedback', sendfeedback)
router.get('/getuserfeedbacks/:user_id', getUserFeedbacks)
router.get('/getfeedbacks/:id', getsinglefeedback)

export default router;