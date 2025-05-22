// 🔥 General API structure for property / car approval flow:
//     POST / api / properties
// ➔ Owner submits property(status defaults to 'pending').

//     GET / api / properties / pending
// ➔ Admin fetches only pending listings(for approval).

//     PUT / api / properties /: id / approve
// ➔ Admin approves the property(status updated to 'approved').

//     PUT / api / properties /: id / reject
// ➔ Admin rejects the property(status updated to 'rejected').

//     GET / api / properties
// ➔ For normal users ➔ Only show approved properties in frontend searches.

import db from '../db.js'; // Your database configuration file
import { validationResult } from 'express-validator';
// 🚗 Get pending cars (for Admin)
export const getPendingCars = (req, res) => {
    const query = 'SELECT * FROM cars WHERE approval_status = "pending"';

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching pending cars', error: err.message });
        }

        return res.status(200).json({ pendingCars: result });
    });
};

// 🏠 Get pending houses (for Admin)
export const getPendingHouses = (req, res) => {
    const query = 'SELECT * FROM houses WHERE approval_status = "pending"';

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching pending houses', error: err.message });
        }

        return res.status(200).json({ pendingHouses: result });
    });
};


// 🚗 Approve a car
export const approveCar = (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE cars SET approval_status = "approved", updated_at = CURRENT_TIMESTAMP WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error approving car', error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        return res.status(200).json({ message: 'Car approved successfully' });
    });
};

// 🏠 Approve a house
export const approveHouse = (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE houses SET approval_status = "approved", updated_at = CURRENT_TIMESTAMP WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error approving house', error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'House not found' });
        }

        return res.status(200).json({ message: 'House approved successfully' });
    });
};



// 🚗 Reject a car
export const rejectCar = (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE cars SET approval_status = "rejected", updated_at = CURRENT_TIMESTAMP WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error rejecting car', error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        return res.status(200).json({ message: 'Car rejected successfully' });
    });
};

// 🏠 Reject a house
export const rejectHouse = (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE houses SET approval_status = "rejected", updated_at = CURRENT_TIMESTAMP WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error rejecting house', error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'House not found' });
        }

        return res.status(200).json({ message: 'House rejected successfully' });
    });
};


export const getPendingListings = (req, res) => {
    const pendingCarsQuery = 'SELECT * FROM cars WHERE approval_status = "pending"';
    const pendingHousesQuery = 'SELECT * FROM houses WHERE approval_status = "pending"';

    db.query(pendingCarsQuery, (carErr, carResult) => {
        if (carErr) {
            return res.status(500).json({ message: 'Error fetching pending cars', error: carErr.message });
        }

        db.query(pendingHousesQuery, (houseErr, houseResult) => {
            if (houseErr) {
                return res.status(500).json({ message: 'Error fetching pending houses', error: houseErr.message });
            }

            return res.status(200).json({
                pendingCars: carResult,
                pendingHouses: houseResult
            });
        });
    });
};
