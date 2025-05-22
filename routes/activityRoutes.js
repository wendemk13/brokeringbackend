import express from 'express';
import { getUserActivity, getRecentActivity } from '../controllers/activityController.js';

const router = express.Router();

router.get('/user/:userId', getUserActivity);
router.get('/recent', getRecentActivity);

export default router;