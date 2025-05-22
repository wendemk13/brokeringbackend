import db from '../db.js';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new car listing
// const createCar = (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     // Handle file upload
//     let coverImagePath = null;
//     if (req.file) {
//         coverImagePath = `/carimages/${req.file.filename}`;
//     }

//     const {
//         title,
//         description,
//         price,
//         make,
//         model,
//         year,
//         mileage,
//         color,
//         condition = 'used',
//         transmission = 'automatic',
//         fuel_type = 'gasoline',
//         status = 'available'
//     } = req.body;

//     const query = `
//         INSERT INTO cars 
//         (title, description, price, make, model, year, mileage, color, 
//          condition, transmission, fuel_type, status, cover_image)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     db.query(query, [
//         title, description, price, make, model, year, mileage, color,
//         condition, transmission, fuel_type, status, coverImagePath
//     ], (err, result) => {
//         if (err) {
//             // Delete uploaded file if there was an error
//             if (req.file) {
//                 fs.unlinkSync(path.join(__dirname, '../uploads/carimages', req.file.filename));
//             }
//             return res.status(500).json({
//                 message: err,
//                 error: err.message
//             });
//         }

//         res.status(201).json({
//             message: 'Car created successfully',
//             car: {
//                 id: result.insertId,
//                 ...req.body,
//                 cover_image: coverImagePath
//             }
//         });
//     });
// };
const createCar = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '../uploads/carimages', req.file.filename));
        }
        return res.status(400).json({
            errors: errors.array(),
            message: 'Validation failed'
        });
    }

    // Handle file upload
    let coverImagePath = null;
    if (req.file) {
        coverImagePath = `/carimages/${req.file.filename}`;
    }

    // Prepare car data matching your schema
    const carData = {
        title: req.body.title,
        description: req.body.description,
        price: parseFloat(req.body.price).toFixed(2),
        make: req.body.make,
        model: req.body.model,
        year: parseInt(req.body.year),
        mileage: req.body.mileage ? parseInt(req.body.mileage) : null,
        color: req.body.color || null,
        transmission: req.body.transmission || 'automatic',
        fuel_type: req.body.fuel_type === 'gasoline' ? 'petrol' : req.body.fuel_type, // Map to correct enum
        status: 'available',
        cover_image: coverImagePath,
        seller_id: req.body.seller_id ? parseInt(req.body.seller_id) : null,
        propertyType: 'car', // Add missing field
        approval_status: 'pending' // Add missing field
    };

    // Validate enum values
    const validTransmissions = ['manual', 'automatic'];
    const validFuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];

    if (!validTransmissions.includes(carData.transmission)) {
        return res.status(400).json({ message: 'Invalid transmission value' });
    }

    if (!validFuelTypes.includes(carData.fuel_type)) {
        return res.status(400).json({ message: 'Invalid fuel type value' });
    }

    const query = `
        INSERT INTO cars 
        (title, description, price, make, model, year, mileage, color, 
         transmission, fuel_type, status, cover_image, seller_id, propertyType, approval_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        carData.title, carData.description, carData.price, carData.make,
        carData.model, carData.year, carData.mileage, carData.color,
        carData.transmission, carData.fuel_type, carData.status,
        carData.cover_image, carData.seller_id, carData.propertyType, carData.approval_status
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);

            if (req.file) {
                fs.unlinkSync(path.join(__dirname, '../uploads/carimages', req.file.filename));
            }

            return res.status(500).json({
                message: 'Database operation failed',
                error: err.message,
                sqlMessage: err.sqlMessage,
                sql: err.sql
            });
        }

        res.status(201).json({
            message: 'Car created successfully',
            car: {
                id: result.insertId,
                ...carData
            }
        });
    });
};
// Get all cars
const getCars = (req, res) => {
    let query = 'SELECT * FROM cars where status="available" and approval_status="approved" ';
    const params = [];

    // Add filters if provided
    if (req.query.minPrice) {
        query += ' WHERE price >= ?';
        params.push(req.query.minPrice);
    }

    if (req.query.maxPrice) {
        query += (params.length ? ' AND' : ' WHERE') + ' price <= ?';
        params.push(req.query.maxPrice);
    }

    if (req.query.make) {
        query += (params.length ? ' AND' : ' WHERE') + ' make = ?';
        params.push(req.query.make);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching cars',
                error: err.message
            });
        }

        res.status(200).json({
            count: results.length,
            cars: results
        });
    });
};

// Get a car by ID
const getCarById = (req, res) => {
    const carId = req.params.id;

    if (!carId || isNaN(carId)) {
        return res.status(400).json({ message: 'Invalid car ID' });
    }

    const query = 'SELECT * FROM cars WHERE id = ?';

    db.query(query, [carId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching car',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json({ car: results[0] });
    });
};

// Update a car listing
// const updateCar = (req, res) => {
//     const carId = Number(req.params.id);
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     if (!carId || isNaN(carId)) {
//         return res.status(400).json({ message: 'Invalid car ID' });
//     }

//     // Handle optional cover image update
//     let coverImageUpdate = '';
//     if (req.file) {
//         coverImageUpdate = ', cover_image = ?';
//     }

//     const {
//         title,
//         description,
//         price,
//         make,
//         model,
//         year,
//         mileage,
//         color,
//         transmission,
//         fuel_type,
//         status,
//         propertyType,
//         approval_status,
//         ForSellRent
//     } = req.body;

//     const query = `
//         UPDATE cars
//         SET 
//             title = ?, 
//             description = ?, 
//             price = ?, 
//             make = ?, 
//             model = ?, 
//             year = ?, 
//             mileage = ?, 
//             color = ?,
//             transmission = ?,
//             fuel_type = ?,
//             status = ?,
//             propertyType = ?,
//             approval_status = ?,
//             ForSellRent = ?
//             ${coverImageUpdate}
//         WHERE id = ?
//     `;

//     const queryParams = [
//         title,
//         description,
//         price,
//         make,
//         model,
//         year,
//         mileage,
//         color,
//         transmission,
//         fuel_type,
//         status,
//         propertyType,
//         approval_status,
//         ForSellRent
//     ];

//     if (req.file) {
//         queryParams.push(`/carimages/${req.file.filename}`);
//     }

//     queryParams.push(carId);

//     db.query(query, queryParams, (err, result) => {
//         if (err) {
//             // Clean up uploaded file if DB query fails
//             if (req.file) {
//                 fs.unlinkSync(path.join(__dirname, '../uploads/carimages', req.file.filename));
//             }
//             return res.status(500).json({
//                 message: 'Error updating car',
//                 error: err.message
//             });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'Car not found' });
//         }

//         return res.status(200).json({ message: 'Car updated successfully' });
//     });
// };
const updateCar = (req, res) => {
    const carId = Number(req.params.id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!carId || isNaN(carId)) {
        return res.status(400).json({ message: 'Invalid car ID' });
    }

    // Handle optional cover image update
    let coverImageUpdate = '';
    if (req.file) {
        coverImageUpdate = ', cover_image = ?';
    }

    // Destructure and assign default values
    const {
        title,
        description,
        price,
        make,
        model,
        year,
        mileage,
        color,
        transmission,
        fuel_type,
        status = 'available',
        propertyType = 'car',
        approval_status = 'pending',
        ForSellRent = 'sell'
    } = req.body;

    const query = `
        UPDATE cars
        SET 
            title = ?, 
            description = ?, 
            price = ?, 
            make = ?, 
            model = ?, 
            year = ?, 
            mileage = ?, 
            color = ?,
            transmission = ?,
            fuel_type = ?,
            status = ?,
            propertyType = ?,
            approval_status = ?,
            ForSellRent = ?
            ${coverImageUpdate}
        WHERE id = ?
    `;

    const queryParams = [
        title,
        description,
        price,
        make,
        model,
        year,
        mileage,
        color,
        transmission,
        fuel_type,
        status,
        propertyType,
        approval_status,
        ForSellRent
    ];

    if (req.file) {
        queryParams.push(`/carimages/${req.file.filename}`);
    }

    queryParams.push(carId);

    db.query(query, queryParams, (err, result) => {
        if (err) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, '../uploads/carimages', req.file.filename));
            }
            return res.status(500).json({
                message: 'Error updating car',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        return res.status(200).json({ message: 'Car updated successfully' });
    });
};

// Delete a car listing
const deleteCar = (req, res) => {
    const carId = req.params.id;

    if (!carId || isNaN(carId)) {
        return res.status(400).json({ message: 'Invalid car ID' });
    }

    // First get the car to delete its image
    const getQuery = 'SELECT cover_image FROM cars WHERE id = ?';

    db.query(getQuery, [carId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Error finding car for deletion',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Delete the car image if it exists
        const car = results[0];
        if (car.cover_image) {
            const imagePath = path.join(__dirname, '../uploads', car.cover_image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Now delete the car record
        const deleteQuery = 'DELETE FROM cars WHERE id = ?';
        db.query(deleteQuery, [carId], (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error deleting car',
                    error: err.message
                });
            }

            res.status(200).json({ message: 'Car deleted successfully' });
        });
    });
};

const updateStatustoSold = (req, res) => {
    const { carid, listingtype } = req.params;
    let status ;
    if (listingtype === 'sell') {
        status = 'sold';
    }
    else {
        status = "rented";
    }
    const query = `update cars set status =? where id=?`;
    db.query(query, [status, carid], (err, data) => {
        if (err) res.json({ "error": err })
        if (data) res.json({ "successfully updated": data })
    })

}



export {
    createCar,
    getCars,
    getCarById,
    updateCar,
    deleteCar, updateStatustoSold
};