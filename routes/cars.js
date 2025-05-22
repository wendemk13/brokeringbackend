import express from 'express';
import { getCars, getCarById, createCar, updateCar, deleteCar, updateStatustoSold } from '../controllers/carscontroller.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer for car images
const carImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/carimages/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `car-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

const carImageUpload = multer({
    storage: carImageStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const router = express.Router();

// Create a new car listing
router.post('/', carImageUpload.single('cover_image'), createCar);

// Get all cars
router.get('/', getCars);

// Get a car by ID
router.get('/:id', getCarById);
// Get a car by ID
router.get('/cars/:id', getCarById);

// Update a car listing
router.put('/:id', carImageUpload.single('cover_image'), updateCar);

// Delete a car listing
router.delete('/:id', deleteCar);

router.put('/updatecarsellstatus/:listingtype/:carid', updateStatustoSold)


export default router;