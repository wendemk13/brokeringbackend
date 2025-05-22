import express from 'express';
import { sendContactMessage, getAllContacts, ownersInboxes } from '../controllers/contactController.js';

const router = express.Router();

router.post('/contact', sendContactMessage);
router.get('/contacts/:userid', ownersInboxes)
router.get('/contacts', getAllContacts); // Optional for admin panel

export default router;
