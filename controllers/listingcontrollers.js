import db from '../db.js'; // Your callback-based database config
import { validationResult } from 'express-validator';

// Get all listings (cars + houses) for a user
const getAllListings = (req, res) => {
    const userId = req.query.userId; // Get userId from query param, e.g., /api/my-listings?userId=2

    if (!userId) {
        return res.status(400).json({ message: 'userId query parameter is required' });
    }

    // Query user’s cars
    db.query('SELECT *, "car" AS type FROM cars WHERE seller_id = ?', [userId], (err, cars) => {
        if (err) {
            console.error('Error fetching cars:', err);
            return res.status(500).send('Server Error');
        }

        // Query user’s houses
        db.query('SELECT *, "house" AS type FROM houses WHERE seller_id = ?', [userId], (err, houses) => {
            if (err) {
                console.error('Error fetching houses:', err);
                return res.status(500).send('Server Error');
            }

            // Combine both
            const listings = [...cars, ...houses];

            res.json(listings); // Return combined listings
        });
    });
};

// Get all listings (cars + houses) for a user
const getTotalListings = (req, res) => {
    // const userId = req.query.userId; // Get userId from query param, e.g., /api/my-listings?userId=2


    // Query user’s cars
    db.query('SELECT *, "car" AS type FROM cars ', [], (err, cars) => {
        if (err) {
            console.error('Error fetching cars:', err);
            return res.status(500).send('Server Error');
        }

        // Query user’s houses
        db.query('SELECT *, "house" AS type FROM houses ', [], (err, houses) => {
            if (err) {
                console.error('Error fetching houses:', err);
                return res.status(500).send('Server Error');
            }

            // Combine both
            const listings = [...cars, ...houses];

            res.json({ "listings": listings }); // Return combined listings
        });
    });
};



// ✅ Get only user's cars
const getUserCars = (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ message: 'userId query parameter is required' });
    }

    db.query('SELECT *, "car" AS propertyType FROM cars WHERE seller_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user cars:', err);
            return res.status(500).json({ message: 'Server Error' });
        }

        res.json(results);
    });
};


// ✅ Get only user's houses
const getUserHouses = (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ message: 'userId query parameter is required' });
    }

    db.query('SELECT *, "House" AS propertyType FROM houses WHERE seller_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user houses:', err);
            return res.status(500).json({ message: 'Server Error' });
        }

        res.json(results);
    });
};






// Delete a user's listing (car or house)
const deleteUserListing = (req, res) => {
    const { listingId, type } = req.body; // Get listingId and type (car or house) from the request body

    if (!listingId || !type) {
        return res.status(400).json({ message: 'listingId and type are required' });
    }

    // Delete the listing based on the type (car or house)
    const query = type === 'car'
        ? 'DELETE FROM cars WHERE id = ?'
        : type === 'house'
            ? 'DELETE FROM houses WHERE id = ?'
            : null;

    if (!query) {
        return res.status(400).json({ message: 'Invalid listing type' });
    }

    db.query(query, [listingId], (err, result) => {
        if (err) {
            console.error('Error deleting listing:', err);
            return res.status(500).json({ message: 'Server Error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.json({ message: 'Listing deleted successfully' });
    });
};

// Update a user's listing (car or house)
const updateUserListing = (req, res) => {
    const { listingId, type, updatedData } = req.body; // Get listingId, type, and updated data from the request body

    if (!listingId || !type || !updatedData) {
        return res.status(400).json({ message: 'listingId, type, and updatedData are required' });
    }

    // Update query based on the type (car or house)
    let query, values;
    if (type === 'car') {
        query = 'UPDATE cars SET ? WHERE id = ?';
        values = [updatedData, listingId];
    } else if (type === 'house') {
        query = 'UPDATE houses SET ? WHERE id = ?';
        values = [updatedData, listingId];
    } else {
        return res.status(400).json({ message: 'Invalid listing type' });
    }

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating listing:', err);
            return res.status(500).json({ message: 'Server Error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.json({ message: 'Listing updated successfully' });
    });
};


export {
    getAllListings, getTotalListings, getUserCars, getUserHouses, deleteUserListing, updateUserListing
};
