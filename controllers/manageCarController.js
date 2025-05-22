import { dbs } from '../db.js';

// GET all cars with optional search, approval_status filter, and pagination
export const getCars = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status } = req.query;
        const offset = (page - 1) * limit;
        const searchQuery = `%${search}%`;

        let whereClause = 'WHERE 1=1';
        const params = [];

        if (search) {
            whereClause += ' AND (title LIKE ? OR make LIKE ? OR model LIKE ?)';
            params.push(searchQuery, searchQuery, searchQuery);
        }

        if (status) {
            whereClause += ' AND approval_status = ?';
            params.push(status.toLowerCase());
        }

        const [countResult] = await dbs.execute(
            `SELECT COUNT(*) as total FROM cars ${whereClause}`,
            params
        );

        const [cars] = await dbs.execute(
            `SELECT * FROM cars ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );

        res.json({
            data: cars,
            total: countResult[0].total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET car approval stats
export const getCarStats = async (req, res) => {
    try {
        const [total] = await dbs.execute('SELECT COUNT(*) AS total FROM cars');
        const [approved] = await dbs.execute("SELECT COUNT(*) AS approved FROM cars WHERE LOWER(approval_status) = 'approved'");
        const [pending] = await dbs.execute("SELECT COUNT(*) AS pending FROM cars WHERE LOWER(approval_status) = 'pending'");
        const [rejected] = await dbs.execute("SELECT COUNT(*) AS rejected FROM cars WHERE LOWER(approval_status) = 'rejected'");

        res.json({
            total: total[0].total,
            approved: approved[0].approved,
            pending: pending[0].pending,
            rejected: rejected[0].rejected
        });
    } catch (error) {
        console.error('Error fetching car stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// PATCH update car availability status (approved or sold)
export const updateCarStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['approved', 'sold'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const [result] = await dbs.execute(
            'UPDATE cars SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.json({ message: `Car status updated to ${status}` });
    } catch (error) {
        console.error('Error updating car status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// PATCH approve car
export const approveCar = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await dbs.execute(
            'UPDATE cars SET approval_status = "approved" WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.json({
            message: 'Car approved successfully',
            data: { id, approval_status: 'approved' }
        });
    } catch (error) {
        console.error('Error approving car:', error);
        res.status(500).json({ message: 'Error approving car', error: error.message });
    }
};

// PATCH reject car
export const rejectCar = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await dbs.execute(
            'UPDATE cars SET approval_status = "rejected" WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.json({
            message: 'Car rejected successfully',
            data: { id, approval_status: 'rejected' }
        });
    } catch (error) {
        console.error('Error rejecting car:', error);
        res.status(500).json({ message: 'Error rejecting car', error: error.message });
    }
};

// DELETE car
export const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await dbs.execute('DELETE FROM cars WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
