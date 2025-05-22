// import db from '../db.js'; // Your database configuration file
// import { validationResult } from 'express-validator';

// // Create a new house listing
// const createHouse = async (req, res) => {
//     const { title, description, price, location, address, bedrooms, bathrooms, area, type, status, seller_id } = req.body;

//     // Validate input
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
//     }
//     console.log(req.body);
//     const query = `
//     INSERT INTO houses (title, description, price, location, address, bedrooms, bathrooms, area, type, status, seller_id)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     db.query(query, [title, description, price, location, address, bedrooms, bathrooms, area, type, status, seller_id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error creating house', error: err.message });
//         }

//         return res.status(201).json({
//             message: 'House created successfully',
//             house: {
//                 // id: result.insertId,
//                 title,
//                 description,
//                 price,
//                 location,
//                 address,
//                 bedrooms,
//                 bathrooms,
//                 area,
//                 type,
//                 status,
//                 seller_id
//             }
//         });
//     });
// };

// // Get all houses
// const getHouses = (req, res) => {
//     const query = 'SELECT * FROM houses';

//     db.query(query, (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error fetching houses', error: err.message });
//         }

//         return res.status(200).json({ houses: result });
//     });
// };

// // Get a house by ID
// const getHouseById = (req, res) => {
//     const { id } = req.params;
//     const query = 'SELECT * FROM houses WHERE id = ?';

//     db.query(query, [id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error fetching house', error: err.message });
//         }

//         if (result.length === 0) {
//             return res.status(404).json({ message: 'House not found' });
//         }

//         return res.status(200).json({ house: result[0] });
//     });
// };

// // Update a house listing
// const updateHouse = (req, res) => {
//     const { id } = req.params;
//     const { title, description, price, location, address, bedrooms, bathrooms, area, type, status } = req.body;

//     const query = `
//     UPDATE houses
//     SET title = ?, description = ?, price = ?, location = ?, address = ?, bedrooms = ?, bathrooms = ?, area = ?, type = ?, status = ?, updated_at = CURRENT_TIMESTAMP
//     WHERE id = ?`;


//     db.query(query, [title, description, price, location, address, bedrooms, bathrooms, area, type, status, id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error updating house', error: err.message });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'House not found' });
//         }

//         return res.status(200).json({ message: 'House updated successfully' });
//     });
// };

// // Delete a house listing
// const deleteHouse = (req, res) => {
//     const { id } = req.params;
//     const query = 'DELETE FROM houses WHERE id = ?';

//     db.query(query, [id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error deleting house', error: err.message });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'House not found' });
//         }

//         return res.status(200).json({ message: 'House deleted successfully' });
//     });
// };

// export {
//     createHouse,
//     getHouses,
//     getHouseById,
//     updateHouse,
//     deleteHouse
// };

// import db from '../db.js';
// import { validationResult } from 'express-validator';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Create a new house listing
// const createHouse = (req, res) => {
//     // Validate input
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             success: false,
//             message: 'Validation failed',
//             errors: errors.array()
//         });
//     }

//     const {
//         title,
//         description,
//         price,
//         location,
//         address,
//         bedrooms,
//         bathrooms,
//         area,
//         type = 'house',
//         status = 'available',
//         seller_id,
//         propertyType
//     } = req.body;

//     // Handle file upload
//     let coverImagePath = null;
//     if (req.file) {
//         coverImagePath = `/houseimages/${req.file.filename}`;
//     }

//     const query = `
//         INSERT INTO houses 
//         (title, description, price, location, address, bedrooms, bathrooms, area, 
//          type, status, seller_id, propertyType, cover_image)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     db.query(query,
//         [
//             title, description, price, location, address,
//             bedrooms || null, bathrooms || null, area || null,
//             type, status, seller_id, propertyType || null, coverImagePath
//         ],
//         (err, result) => {
//             if (err) {
//                 // Delete uploaded file if there was an error
//                 if (req.file) {
//                     fs.unlinkSync(path.join(__dirname, '../uploads/houseimages', req.file.filename));
//                 }

//                 console.error('Database error:', err);
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Failed to create house listing',
//                     error: err.message
//                 });
//             }

//             res.status(201).json({
//                 success: true,
//                 message: 'House created successfully',
//                 data: {
//                     id: result.insertId,
//                     title,
//                     description,
//                     price,
//                     location,
//                     address,
//                     bedrooms,
//                     bathrooms,
//                     area,
//                     type,
//                     status,
//                     seller_id,
//                     propertyType,
//                     cover_image: coverImagePath
//                 }
//             });
//         }
//     );
// };


// // Create a new house listing
// // const createHouse = (req, res) => {
// //     // Validate input
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //         return res.status(400).json({
// //             success: false,
// //             message: 'Validation failed',
// //             errors: errors.array()
// //         });
// //     }

// //     const {
// //         title,
// //         description,
// //         price,
// //         location,
// //         address,
// //         bedrooms,
// //         bathrooms,
// //         area,
// //         type = 'house',
// //         status = 'available',
// //         seller_id
// //     } = req.body;

// //     const query = `
// //         INSERT INTO houses 
// //         (title, description, price, location, address, bedrooms, bathrooms, area, type, status, seller_id)
// //         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// //     `;

// //     db.query(query,
// //         [title, description, price, location, address, bedrooms, bathrooms, area, type, status, seller_id],
// //         (err, result) => {
// //             if (err) {
// //                 console.error('Database error:', err);
// //                 return res.status(500).json({
// //                     success: false,
// //                     message: 'Failed to create house listing',
// //                     error: err.message
// //                 });
// //             }

// //             res.status(201).json({
// //                 success: true,
// //                 message: 'House created successfully',
// //                 data: {
// //                     id: result.insertId,
// //                     ...req.body
// //                 }
// //             });
// //         }
// //     );
// // };

// // Get all houses with optional filters
// const getHouses = (req, res) => {
//     let query = 'SELECT * FROM houses WHERE 1=1';
//     const params = [];

//     // Add filters if provided
//     if (req.query.minPrice) {
//         query += ' AND price >= ?';
//         params.push(req.query.minPrice);
//     }

//     if (req.query.maxPrice) {
//         query += ' AND price <= ?';
//         params.push(req.query.maxPrice);
//     }

//     if (req.query.type) {
//         query += ' AND type = ?';
//         params.push(req.query.type);
//     }

//     db.query(query, params, (err, results) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Failed to fetch houses',
//                 error: err.message
//             });
//         }

//         res.status(200).json({
//             success: true,
//             count: results.length,
//             data: results
//         });
//     });
// };

// // Get single house by ID
// const getHouseById = (req, res) => {
//     const houseId = req.params.id;

//     if (!houseId || isNaN(houseId)) {
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid house ID'
//         });
//     }

//     const query = 'SELECT * FROM houses WHERE id = ?';

//     db.query(query, [houseId], (err, results) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Failed to fetch house',
//                 error: err.message
//             });
//         }

//         if (results.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'House not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: results[0]
//         });
//     });
// };

// // Update house listing
// const updateHouse = (req, res) => {
//     const houseId = req.params.id;

//     if (!houseId || isNaN(houseId)) {
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid house ID'
//         });
//     }

//     const {
//         title,
//         description,
//         price,
//         location,
//         address,
//         bedrooms,
//         bathrooms,
//         area,
//         type,
//         status
//     } = req.body;

//     const query = `
//         UPDATE houses
//         SET title = ?, 
//             description = ?, 
//             price = ?, 
//             location = ?, 
//             address = ?, 
//             bedrooms = ?, 
//             bathrooms = ?, 
//             area = ?, 
//             type = ?, 
//             status = ?,
//             updated_at = CURRENT_TIMESTAMP
//         WHERE id = ?
//     `;

//     db.query(query,
//         [title, description, price, location, address, bedrooms, bathrooms, area, type, status, houseId],
//         (err, result) => {
//             if (err) {
//                 console.error('Database error:', err);
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Failed to update house',
//                     error: err.message
//                 });
//             }

//             if (result.affectedRows === 0) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'House not found'
//                 });
//             }

//             res.status(200).json({
//                 success: true,
//                 message: 'House updated successfully'
//             });
//         }
//     );
// };

// // Delete house listing
// const deleteHouse = (req, res) => {
//     const houseId = req.params.id;

//     if (!houseId || isNaN(houseId)) {
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid house ID'
//         });
//     }

//     const query = 'DELETE FROM houses WHERE id = ?';

//     db.query(query, [houseId], (err, result) => {
//         if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Failed to delete house',
//                 error: err.message
//             });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'House not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'House deleted successfully'
//         });
//     });
// };

// export {
//     createHouse,
//     getHouses,
//     getHouseById,
//     updateHouse,
//     deleteHouse
// };




import db from '../db.js';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new house listing with image upload
const createHouse = (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const {
        title,
        description,
        price,
        location,
        address,
        bedrooms,
        bathrooms,
        area,
        type = 'house',
        status = 'available',
        seller_id,
        propertyType
    } = req.body;

    // Handle file upload
    let coverImagePath = null;
    if (req.file) {
        // Create houseimages directory if it doesn't exist
        const uploadDir = path.join(__dirname, '../uploads/houseimages');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        coverImagePath = `/houseimages/${req.file.filename}`;
    }

    const query = `
        INSERT INTO houses 
        (title, description, price, location, address, bedrooms, bathrooms, area, 
         type, status, seller_id, propertyType, cover_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query,
        [
            title, description, price, location, address,
            bedrooms || null, bathrooms || null, area || null,
            type, status, seller_id, propertyType || null, coverImagePath
        ],
        (err, result) => {
            if (err) {
                // Delete uploaded file if there was an error
                if (req.file) {
                    fs.unlinkSync(path.join(__dirname, '../uploads/houseimages', req.file.filename));
                }

                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    // message: 'Failed to create house listing',
                    message: err,
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: 'House created successfully',
                data: {
                    id: result.insertId,
                    title,
                    description,
                    price,
                    location,
                    address,
                    bedrooms,
                    bathrooms,
                    area,
                    type,
                    status,
                    seller_id,
                    propertyType,
                    cover_image: coverImagePath
                }
            });
        }
    )
};

// Get all houses with optional filters
const getHouses = (req, res) => {
    let query = `SELECT * FROM houses WHERE  status="available" and approval_status="approved" `;
    const params = [];

    // Add filters if provided
    if (req.query.minPrice) {
        query += ' AND price >= ?'
        params.push(req.query.minPrice);
    }

    if (req.query.maxPrice) {
        query += ' AND price <= ?';
        params.push(req.query.maxPrice);
    }

    if (req.query.type) {
        query += ' AND type = ?';
        params.push(req.query.type);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch houses',
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    });
};

// Get single house by ID
const getHouseById = (req, res) => {
    const houseId = req.params.id;

    if (!houseId || isNaN(houseId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid house ID'
        });
    }

    const query = 'SELECT * FROM houses WHERE id = ?';

    db.query(query, [houseId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch house',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'House not found'
            });
        }

        res.status(200).json({
            success: true,
            data: results[0]
        });
    });
};

// Update house listing with image upload
// const updateHouse = (req, res) => {
//     const houseId = req.params.id;

//     if (!houseId || isNaN(houseId)) {
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid house ID'
//         });
//     }

//     const {
//         title,
//         description,
//         price,
//         location,
//         address,
//         bedrooms,
//         bathrooms,
//         area,
//         type,
//         status,
//         propertyType
//     } = req.body;

//     // Handle file upload if new image was provided
//     let coverImageUpdate = '';
//     if (req.file) {
//         const uploadDir = path.join(__dirname, '../uploads/houseimages');
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true });
//         }
//         coverImageUpdate = ', cover_image = ?';
//     }

//     const query = `
//         UPDATE houses
//         SET title = ?, 
//             description = ?, 
//             price = ?, 
//             location = ?, 
//             address = ?, 
//             bedrooms = ?, 
//             bathrooms = ?, 
//             area = ?, 
//             type = ?, 
//             status = ?,
//             propertyType = ?,
//             updated_at = CURRENT_TIMESTAMP
//             ${coverImageUpdate}
//         WHERE id = ?
//     `;

//     const queryParams = [
//         title, description, price, location, address,
//         bedrooms, bathrooms, area, type, status, propertyType
//     ];

//     // Add image path if new image was uploaded
//     if (req.file) {
//         queryParams.push(`/houseimages/${req.file.filename}`);
//     }

//     queryParams.push(houseId);

//     db.query(query, queryParams, (err, result) => {
//         if (err) {
//             // Delete uploaded file if there was an error
//             if (req.file) {
//                 fs.unlinkSync(path.join(__dirname, '../uploads/houseimages', req.file.filename));
//             }

//             console.error('Database error:', err);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Failed to update house',
//                 error: err.message
//             });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'House not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'House updated successfully'
//         });
//     });
// };
const updateHouse = (req, res) => {
    const houseId = req.params.id;

    if (!houseId || isNaN(houseId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid house ID',
        });
    }

    const {
        title,
        description,
        price,
        location,
        address,
        bedrooms,
        bathrooms,
        area,
        type,
        status,
        propertyType,
        approval_status,
        ForSellRent,
    } = req.body;

    // Prepare cover image update part
    let coverImageUpdate = '';
    if (req.file) {
        const uploadDir = path.join(__dirname, '../uploads/houseimages');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        coverImageUpdate = ', cover_image = ?';
    }

    const query = `
      UPDATE houses
      SET title = ?, 
          description = ?, 
          price = ?, 
          location = ?, 
          address = ?, 
          bedrooms = ?, 
          bathrooms = ?, 
          area = ?, 
          type = ?, 
          status = ?,
          propertyType = ?,
          approval_status = ?,
          ForSellRent = ?,
          updated_at = CURRENT_TIMESTAMP
          ${coverImageUpdate}
      WHERE id = ?
    `;

    // Build query parameters
    const queryParams = [
        title,
        description,
        price,
        location,
        address,
        bedrooms,
        bathrooms,
        area,
        type,
        status,
        propertyType,
        approval_status,
        ForSellRent,
    ];

    if (req.file) {
        queryParams.push(`/houseimages/${req.file.filename}`);
    }

    queryParams.push(houseId);

    db.query(query, queryParams, (err, result) => {
        if (err) {
            if (req.file) {
                // Delete uploaded file if DB error occurs
                fs.unlinkSync(path.join(__dirname, '../uploads/houseimages', req.file.filename));
            }

            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to update house',
                error: err.message,
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'House not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'House updated successfully',
        });
    });
};



// Delete house listing
const deleteHouse = (req, res) => {
    const houseId = req.params.id;

    if (!houseId || isNaN(houseId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid house ID'
        });
    }

    // First get the house to delete its image
    const getQuery = 'SELECT cover_image FROM houses WHERE id = ?';

    db.query(getQuery, [houseId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to find house for deletion',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'House not found'
            });
        }

        // Delete the house image if it exists
        const house = results[0];
        if (house.cover_image) {
            const imagePath = path.join(__dirname, '../uploads', house.cover_image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Now delete the house record
        const deleteQuery = 'DELETE FROM houses WHERE id = ?';
        db.query(deleteQuery, [houseId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete house',
                    error: err.message
                });
            }

            res.status(200).json({
                success: true,
                message: 'House deleted successfully'
            });
        });
    });
};


const updateStatustoSold = (req, res) => {
    const { houseid, listingtype } = req.params;
    let status ;
    if (listingtype === 'sell') {
        status = 'sold';
    }
    else {
        status = "rented";
    } const query = `update houses set status =? where id=?`;
    db.query(query, [status, houseid], (err, data) => {
        if (err) res.json({ "error": err })
        if (data) res.json({ "successfully updated": data })
    })

}

export {
    createHouse,
    getHouses,
    getHouseById,
    updateHouse,
    deleteHouse,
    updateStatustoSold
};

