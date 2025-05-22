import { dbs } from '../db.js';

// GET all houses with optional search, status filter, and pagination
export const getHouses = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status } = req.query;
        const offset = (page - 1) * limit;
        const searchQuery = `%${search}%`;

        let whereClause = 'WHERE 1=1';
        const params = [];

        if (search) {
            whereClause += ' AND (title LIKE ? OR address LIKE ?)';
            params.push(searchQuery, searchQuery);
        }

        if (status) {
            whereClause += ' AND status = ?';
            params.push(status);
        }

        const [countResult] = await dbs.execute(
            `SELECT COUNT(*) as total FROM houses ${whereClause}`,
            params
        );

        const [houses] = await dbs.execute(
            `SELECT * FROM houses ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );

        res.json({
            data: houses,
            total: countResult[0].total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Error fetching houses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET house status stats
export const getStats = async (req, res) => {
    try {
        const [total] = await dbs.execute('SELECT COUNT(*) AS total FROM houses');
        const [available] = await dbs.execute("SELECT COUNT(*) AS available FROM houses WHERE LOWER(approval_status) = 'approved'");
        const [pending] = await dbs.execute("SELECT COUNT(*) AS pending FROM houses WHERE LOWER(approval_status) = 'pending'");
        const [rejected] = await dbs.execute("SELECT COUNT(*) AS rejected FROM houses WHERE LOWER(approval_status) = 'rejected'");

        res.json({
            total: total[0].total,
            available: available[0].available,
            pending: pending[0].pending,
            rejected: rejected[0].rejected
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// PUT update house status by ID
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['Pending', 'approved', 'Rejected'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const [result] = await dbs.execute(
            'UPDATE houses SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'House not found' });
        }

        res.json({ message: `Status updated to ${status}` });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE house by ID
export const deleteHouse = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await dbs.execute('DELETE FROM houses WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'House not found' });
        }

        res.json({ message: 'House deleted successfully' });
    } catch (error) {
        console.error('Error deleting house:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve a house
export const approveHouse = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await dbs.execute(
            'UPDATE houses SET approval_status = "approved" WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'House not found' });
        }

        res.json({
            message: 'House approved successfully',
            data: { id, approval_status: 'approved' }
        });
    } catch (error) {
        console.error('Error approving house:', error);
        res.status(500).json({ message: 'Error approving house', error: error.message });
    }
};

// Reject a house
export const rejectHouse = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await dbs.execute(
            'UPDATE houses SET approval_status = "Rejected" WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'House not found' });
        }

        res.json({
            message: 'House rejected successfully',
            data: { id, approval_status: 'Rejected' }
        });
    } catch (error) {
        console.error('Error rejecting house:', error);
        res.status(500).json({ message: 'Error rejecting house', error: error.message });
    }
};

