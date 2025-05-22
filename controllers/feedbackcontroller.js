// const sendfeedback = (req, res) => {
//     const user_id = req.session?.user?.id || null; // Get user_id from session
//     const { message } = req.body;

//     if (!name || !email || !message) {
//         return res.status(400).json({ success: false, message: 'Required fields are missing.' });
//     }

//     const query = 'INSERT INTO feedbacks (user_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)';
//     const values = [user_id, message];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error('Error saving message:', err);
//             return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
//         }

//         res.status(200).json({ success: true, message: 'Message sent successfully!' });
//     });
// };

import db from '../db.js';

const getAllFeedbacks = (req, res) => {
    const query = 'select * from feedbacks'
    db.query(query, (err, data) => {
        if (err) res.json({ error: "error fetching Feedbacks" })
        res.json({ data })
    })

}

const sendfeedback = (req, res) => {
    // Get user ID from request body (sent from frontend)
    const user_id = req.body?.user_id || null;
    const { name, email, phone, message } = req.body;

    // if (!name || !email || !message) {
    //     return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    // }

    const query = 'INSERT INTO feedbacks (user_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)';
    const values = [user_id, name, email, phone, message];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error saving message:', err);
            return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
        }

        res.status(200).json({ success: true, message: values });
    });
};

const getUserFeedbacks = (req, res) => {
    const user_id = req.params.user_id; // Or use req.body.user_id if sending in POST body

    const query = 'SELECT * FROM feedbacks WHERE user_id = ?';
    db.query(query, [user_id], (err, data) => {
        if (err) return res.status(500).json({ error: 'Error fetching user feedbacks' });
        res.json({ data });
    });
};


const getsinglefeedback = (req, res) => {
    const feedbackId = req.params.id;

    if (!feedbackId) {
        return res.status(400).json({ error: 'Feedback ID is required' });
    }

    const feedbackQuery = 'SELECT * FROM feedbacks WHERE id = ?';

    db.query(feedbackQuery, [feedbackId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error fetching replies' });
        res.json({ "feedback": result })
    })
};



export { sendfeedback, getAllFeedbacks, getUserFeedbacks, getsinglefeedback };