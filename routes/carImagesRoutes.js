import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadCarImage, getCarImages, deleteImage } from '../controllers/carImagesController.js';

// Set up multer storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Save images to the 'uploads/carimages' folder
        cb(null, 'uploads/carimages'); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        // Create a filename with a timestamp and original file extension
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = Date.now() + '-' + file.fieldname + ext;
        cb(null, filename); // Save file with a timestamped filename
    }
});

// Optional: file filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file if it's an image
    } else {
        cb(new Error('Only image files are allowed'), false); // Reject if it's not an image
    }
};

// Create the upload middleware
const upload = multer({ storage, fileFilter });

const router = express.Router();

// Route to upload car image
router.post('/upload-car-image', upload.single('image'), uploadCarImage);

// Route to get images for a specific car
router.get('/car-images/:carid', getCarImages);

// Route to delete a specific image
router.delete('/delete-car-image/:id', deleteImage);

export default router;
