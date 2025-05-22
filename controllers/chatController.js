import {dbs} from '../db.js';

// ✅ Get all chat messages between two users
export const getChatMessages = async (req, res) => {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    try {
        const [rows] = await dbs.execute(
            `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) OR 
             (sender_id = ? AND receiver_id = ?) 
       ORDER BY created_at ASC`,
            [currentUserId, otherUserId, otherUserId, currentUserId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// ✅ Send a chat message
export const sendMessage = async (req, res) => {
    const from = req.user.id;
    const { to, message } = req.body;

    try {
        await dbs.execute(
            'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
            [from, to, message]
        );
        res.json({ from_self: true, message });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ error: 'Failed to send message' });
    }
};
