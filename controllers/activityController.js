import db from '../db.js';

export const getUserActivity = async (req, res) => {
    try {
        const activities = await db.Activity.findAll({
            where: { userId: req.params.userId },
            limit: parseInt(req.query.limit) || 10,
            order: [['timestamp', 'DESC']],
            include: [{
                model: db.User,
                attributes: ['username', 'email']
            }]
        });

        res.json(activities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getRecentActivity = async (req, res) => {
    try {
        const activities = await db.Activity.findAll({
            limit: parseInt(req.query.limit) || 5,
            order: [['timestamp', 'DESC']],
            include: [{
                model: db.User,
                attributes: ['username']
            }]
        });

        res.json(activities.map(activity => ({
            userName: activity.User.username,
            action: activity.action,
            timestamp: activity.timestamp
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};