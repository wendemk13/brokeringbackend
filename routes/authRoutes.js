// import express from 'express';
// import { registerUser, loginUser, getAllUsers, updateProfile, getUser } from '../controllers/authController.js';
// import { body } from 'express-validator';

// const router = express.Router();

// // Route for user registration
// // router.post(
// //     '/register',
// //     registerUser
// // );
// router.post('/register', upload.single('profile_image'), registerUser);


// router.post(
//     '/login',
//     [
//         body('email').isEmail().withMessage('Valid email is required'),
//         body('password').notEmpty().withMessage('Password is required')
//     ],
//     loginUser
// );
// router.get(
//     '/getAllUsers', getAllUsers
// );
// router.get(
//     '/getUser/:userid', getUser
// );
// router.put('/update/:userid', updateProfile)

// export default router;



import express from 'express';
import multer from 'multer';
import path from 'path';
import { registerUser, loginUser, getAllUsers, updateProfile, getUser, changePassword } from '../controllers/authController.js';
import { body } from 'express-validator';

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile'); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + '-' + file.fieldname + ext;
        cb(null, filename);
    }
});

// Optional: file filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Create the upload middleware
const upload = multer({ storage, fileFilter });

const router = express.Router();

// Route for user registration with profile image upload
router.post('/register', upload.single('profile_image'), registerUser);

// Route for user login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    loginUser
);

// Route to get all users (admin-only route)
router.get('/getAllUsers', getAllUsers);

// Route to get a single user by ID
router.get('/getUser/:userid', getUser);

// Route for updating user profile
router.put('/update/:userid', upload.single('profile_image'), updateProfile);
// Route for updating password
router.put('/updatepassword/:userid', changePassword);

export default router;
