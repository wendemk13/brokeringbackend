import db from '../db.js'; // Ensure you have your DB connection here
import path from 'path';

// Get all images
export const getAllImages = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM houseimages');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get images by house ID
export const getImagesByHouseId = async (req, res) => {
    const { houseid } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM houseimages WHERE houseid = ?', [houseid]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get main image(s)
export const getMainImage = async (req, res) => {
    const { houseid } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM houseimages WHERE houseid = ? AND type = "main"', [houseid]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get helper images
export const getHelperImages = async (req, res) => {
    const { houseid } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM houseimages WHERE houseid = ? AND type = "helper"', [houseid]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new image
export const addImage = async (req, res) => {
    const { houseid, type } = req.body;

    if (!houseid) {
        return res.status(400).json({ message: 'House ID is required' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }

    // Construct the relative image URL
    const imageUrl = path.join('uploads', 'houseimages', req.file.filename);

    try {
        const [result] = await db.query(
            'INSERT INTO houseimages (houseid, image_url, type) VALUES (?, ?, ?)',
            [houseid, imageUrl, type || 'helper']
        );
        res.status(201).json({ id: result.insertId, houseid, image_url: imageUrl, type });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete image
export const deleteImage = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM houseimages WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.json({ message: 'Image deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
