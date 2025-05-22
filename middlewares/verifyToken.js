import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(403).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};
