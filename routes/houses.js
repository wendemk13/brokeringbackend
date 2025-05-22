import express from 'express';
import { body } from 'express-validator';
import { createHouse, getHouses, getHouseById, updateHouse, deleteHouse, updateStatustoSold } from '../controllers/houseController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer specifically for house images
const houseImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/houseimages/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `house-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

const houseImageUpload = multer({
    storage: houseImageStorage,
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

// Validation rules
const houseValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('location').notEmpty().withMessage('Location is required'),
    body('bedrooms').optional().isInt({ min: 0 }),
    body('bathrooms').optional().isFloat({ min: 0 }),
    body('area').optional().isInt({ min: 0 }),
    body('seller_id').notEmpty().withMessage('Seller ID is required')
];

// Create a new house listing
router.post('/',
    houseImageUpload.single('cover_image'),
    // houseValidationRules,
    createHouse
);

// Get all houses
router.get('/', getHouses);

// Get a house by ID
router.get('/:id', getHouseById);

// Update a house listing
router.put('/:id',
    houseImageUpload.single('cover_image'),
    updateHouse
);

// Delete a house listing
router.delete('/:id', deleteHouse);
router.put('/updatesellstatus/:listingtype/:houseid', updateStatustoSold)

export default router;