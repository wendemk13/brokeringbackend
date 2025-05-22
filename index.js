import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';  // Import routes
import houseRoutes from './routes/houses.js'
import carRoutes from './routes/cars.js'
import houseImageRoutes from './routes/houseImagesRoutes.js'
import listingroutes from './routes/listingroutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import { validationResult } from 'express-validator';
import approvalRoutes from './routes/approval.js'
import feedbackRoutes from './routes/feedbackroutes.js';
import userRoutes from './routes/userRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import db from './db.js';
import manageHouseRoutes from './routes/manageHouseRoutes.js';
import manageCarRoutes from './routes/manageCarRoutes.js'
import repliesRoutes from './routes/repliesRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());  // Parse JSON data
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/house', houseRoutes);
app.use('/api/houseimages', houseImageRoutes);
app.use('/api/car', carRoutes)
app.use('/api', listingroutes)
app.use('/api/payment', paymentRoutes);
app.use('/api/approval', approvalRoutes);
app.post('/deletenull', (req, res) => {
    const query = 'DELETE FROM cars WHERE cover_image IS NULL';

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error while deleting null cover images', details: err });
        }

        res.json({ message: 'Successfully deleted cars with null cover_image', affectedRows: result.affectedRows });
    });
});


app.use('/api/feedback', feedbackRoutes)
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/activity', activityRoutes);
app.use('/api/admin', manageHouseRoutes);
app.use('/api/admin', manageCarRoutes);
app.use('/api/replies', repliesRoutes)
app.use('/api', contactRoutes);
app.use('/api', chatRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

