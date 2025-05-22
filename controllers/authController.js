import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

import { validationResult } from 'express-validator';

// Register user controller
// const registerUser = async (req, res) => {
//     const { username, email, password, first_name, last_name, role } = req.body;

//     // Validate input
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
//     }

//     // Check if username or email exists
//     const checkUserQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
//     db.query(checkUserQuery, [username, email], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Server error', error: err.message });
//         }

//         if (result.length > 0) {
//             return res.status(400).json({ message: 'Username or email already exists' });
//         }

//         // Hash password
//         bcrypt.hash(password, 10, (err, hashedPassword) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Error hashing password' });
//             }

//             // Insert new user
//             const insertUserQuery = `
//                 INSERT INTO users (username, email, password_hash, first_name, last_name, role)
//                 VALUES (?, ?, ?, ?, ?, ?)`;

//             db.query(insertUserQuery, [username, email, hashedPassword, first_name, last_name, role], (err, result) => {
//                 if (err) {
//                     return res.status(500).json({ message: 'Error creating user', error: err.message });
//                 }

//                 // Generate token
//                 const token = jwt.sign(
//                     { username: username, role: role },
//                     process.env.JWT_SECRET_KEY || 'your_secret_key',
//                     { expiresIn: '1h' }
//                 );

//                 return res.status(201).json({
//                     message: 'User registered successfully',
//                     token: token,
//                     user: {
//                         username,
//                         first_name,
//                         last_name,
//                         role
//                     }
//                 });
//             });
//         });
//     });
// };
const registerUser = async (req, res) => {
    const { username, email, password, first_name, last_name, role } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const profileImage = req.file ? req.file.filename : null;

    const checkUserQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
    db.query(checkUserQuery, [username, email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error', error: err.message });

        if (result.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: 'Error hashing password' });

            const insertUserQuery = `
                INSERT INTO users (username, email, password_hash, first_name, last_name, role, profile_image)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

            db.query(insertUserQuery, [username, email, hashedPassword, first_name, last_name, role, profileImage], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error creating user', error: err.message });
                }

                const token = jwt.sign(
                    { username: username, role: role },
                    process.env.JWT_SECRET_KEY || 'your_secret_key',
                    { expiresIn: '1h' }
                );

                return res.status(201).json({
                    message: 'User registered successfully',
                    token: token,
                    user: {
                        username,
                        first_name,
                        last_name,
                        role,
                        profile_image: profileImage
                    }
                });
            });
        });
    });
};


// Login user controller
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    // Check if user exists
    const findUserQuery = `SELECT * FROM users WHERE email = ?`;
    db.query(findUserQuery, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET_KEY || 'your_secret_key',
            { expiresIn: '1h' }
        );

        // Respond with token and user info
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: user.profile_image
            }
        });
    });
};
const getAllUsers = async (req, res) => {


    // Check if user exists
    const findUserQuery = `SELECT * FROM users`;
    db.query(findUserQuery, [], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (results) {
            res.status(200).json({ "users": results });
        }



    });
};
const getUser = async (req, res) => {
    // Check if user exists
    const { userid } = req.params;
    const findUserQuery = `SELECT * FROM users where id=?`;
    db.query(findUserQuery, [userid], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (results) {
            res.status(200).json({ "user": results });
        }



    });
}
const updateProfile = async (req, res) => {
    const { userid } = req.params;
    const { first_name, last_name, username, email, password, role } = req.body;

    // If a new profile image is uploaded, get the filename
    const profileImage = req.file ? req.file.filename : null;

    // Check if the user exists
    const checkUserQuery = 'SELECT * FROM users WHERE id = ?';
    db.query(checkUserQuery, [userid], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result[0];

        // If the password is updated, hash it
        let hashedPassword = user.password_hash;
        if (password) {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ message: 'Error hashing password' });
                }
                hashedPassword = hash;
                // Proceed with updating user data after hashing the password
                updateUser();
            });
        } else {
            updateUser();
        }

        function updateUser() {
            // Update the user in the database
            const updateQuery = `
        UPDATE users 
        SET first_name = ?, last_name = ?, username = ?, email = ?, password_hash = ?, role = ?, profile_image = ?
        WHERE id = ?`;

            db.query(
                updateQuery,
                [
                    first_name || user.first_name,
                    last_name || user.last_name,
                    username || user.username,
                    email || user.email,
                    hashedPassword,
                    role || user.role,
                    profileImage || user.profile_image, // Keep existing profile image if not provided
                    userid
                ],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating user', error: err.message });
                    }

                    // Return the updated user info (excluding password)
                    return res.status(200).json({
                        message: 'User profile updated successfully',
                        user: {
                            id: userid,
                            first_name: first_name || user.first_name,
                            last_name: last_name || user.last_name,
                            username: username || user.username,
                            email: email || user.email,
                            role: role || user.role,
                            profile_image: profileImage || user.profile_image,
                        }
                    });
                }
            );
        }
    });
};
const changePassword = async (req, res) => {
    const { userid } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Check if the user exists
    const checkUserQuery = 'SELECT * FROM users WHERE id = ?';
    db.query(checkUserQuery, [userid], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result[0];

        // If the current password is provided, compare it with the stored hash
        bcrypt.compare(currentPassword, user.password_hash, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing password' });
            }

            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            // Hash the new password
            if (newPassword) {
                bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error hashing password' });
                    }

                    // Proceed with updating the password in the database
                    updatePassword(hashedPassword);
                });
            } else {
                return res.status(400).json({ message: 'New password is required' });
            }
        });
    });

    // Function to update the password in the database
    function updatePassword(hashedPassword) {
        const updateQuery = `
      UPDATE users 
      SET password_hash = ? 
      WHERE id = ?
    `;

        db.query(updateQuery, [hashedPassword, userid], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating password', error: err.message });
            }

            return res.status(200).json({
                message: 'Password updated successfully',
            });
        });
    }
};


export { registerUser, loginUser, getAllUsers, updateProfile, getUser, changePassword };
