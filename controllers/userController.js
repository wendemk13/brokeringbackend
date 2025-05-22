import db from '../db.js';
import bcrypt from 'bcryptjs';
import { dbs } from '../db.js';


// Helper: Hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};


// GET all users (with optional filters)
export const getUsers = async (req, res) => {
    try {
        const { role, is_active } = req.query;
        let query = 'SELECT * FROM users';
        const params = [];

        const conditions = [];
        if (role) {
            conditions.push('role = ?');
            params.push(role);
        }
        if (is_active !== undefined) {
            conditions.push('is_active = ?');
            params.push(is_active === 'true' ? 1 : 0);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [users] = await dbs.query(query, params); // Works with mysql2/promise
        res.json(users);
    } catch (err) {
        console.error('getUsers error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


// GET basic user statistics
export const getUserStats = async (req, res) => {
    try {
        const [totalRows] = await dbs.execute('SELECT COUNT(*) as total FROM users');
        const [activeRows] = await dbs.execute('SELECT COUNT(*) as active FROM users WHERE is_active = 1');
        const [todayRows] = await dbs.execute('SELECT COUNT(*) as today FROM users WHERE DATE(created_at) = CURDATE()');

        const total = totalRows[0]?.total || 0;
        const active = activeRows[0]?.active || 0;
        const today = todayRows[0]?.today || 0;

        res.json({ total, active, today });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET user by ID
export const getUserById = async (req, res) => {
    try {
        const [rows] = await dbs.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST create user
export const createUser = async (req, res) => {
    try {
        const { username, email, first_name, last_name, role, password } = req.body;
        const hashedPassword = await hashPassword(password);

        const [result] = await dbs.execute(
            `INSERT INTO users (username, email, first_name, last_name, role, password_hash, is_active)
             VALUES (?, ?, ?, ?, ?, ?, 1)`,
            [username, email, first_name, last_name, role, hashedPassword]
        );

        res.status(201).json({ id: result.insertId, message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// PUT update user
export const updateUser = async (req, res) => {
    try {
        const { username, email, first_name, last_name, role, is_active, password } = req.body;

        const [user] = await dbs.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (user.length === 0) return res.status(404).json({ message: 'User not found' });

        let query = 'UPDATE users SET ';
        const fields = [];
        const values = [];

        if (username) { fields.push('username = ?'); values.push(username); }
        if (email) { fields.push('email = ?'); values.push(email); }
        if (first_name) { fields.push('first_name = ?'); values.push(first_name); }
        if (last_name) { fields.push('last_name = ?'); values.push(last_name); }
        if (role) { fields.push('role = ?'); values.push(role); }
        if (typeof is_active !== 'undefined') { fields.push('is_active = ?'); values.push(is_active); }
        if (password) {
            const hashed = await hashPassword(password);
            fields.push('password_hash = ?');
            values.push(hashed);
        }

        if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });

        query += fields.join(', ') + ' WHERE id = ?';
        values.push(req.params.id);

        await dbs.execute(query, values);

        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// PATCH update user status
export const updateUserStatus = async (req, res) => {
    try {
        const { is_active } = req.body;
        const [user] = await dbs.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (user.length === 0) return res.status(404).json({ message: 'User not found' });

        await dbs.execute('UPDATE users SET is_active = ? WHERE id = ?', [is_active, req.params.id]);
        res.json({ message: 'User status updated', is_active });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE user
export const deleteUser = async (req, res) => {
    try {
        const [user] = await dbs.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (user.length === 0) return res.status(404).json({ message: 'User not found' });

        await dbs.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
