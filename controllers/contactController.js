import db from '../db.js';

// POST /api/contact
// export const sendContactMessage = (req, res) => {
//     const { contact_type, house_id, car_id, sender_name, sender_email, message } = req.body;

//     if (!['house', 'car'].includes(contact_type)) {
//         return res.status(400).json({ error: 'Invalid contact type' });
//     }

//     const query = `
//     INSERT INTO contacts (contact_type, house_id, car_id, sender_name, sender_email, message)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;

//     db.query(
//         query,
//         [contact_type, house_id || null, car_id || null, sender_name, sender_email, message],
//         (err, result) => {
//             if (err) {
//                 console.error('Error inserting contact:', err);
//                 return res.status(500).json({ error: 'Database error' });
//             }
//             res.status(201).json({ message: 'Contact message sent successfully!' });
//         }
//     );
// };
// export const sendContactMessage = (req, res) => {
//     const { contact_type, house_id, car_id, user_id, message } = req.body;

//     if (!['house', 'car'].includes(contact_type)) {
//         return res.status(400).json({ error: 'Invalid contact type' });
//     }

//     if (!user_id) {
//         return res.status(400).json({ error: 'User ID is required' });
//     }

//     const query = `
//       INSERT INTO contacts (contact_type, house_id, car_id, user_id, message)
//       VALUES (?, ?, ?, ?, ?)
//     `;

//     db.query(
//         query,
//         [contact_type, house_id || null, car_id || null, user_id, message],
//         (err, result) => {
//             if (err) {
//                 console.error('Error inserting contact:', err);
//                 return res.status(500).json({ error: 'Database error' });
//             }
//             res.status(201).json({ message: 'Contact message sent successfully!' });
//         }
//     );
// };
export const sendContactMessage = (req, res) => {
    const {
        contact_type,
        house_id,
        car_id,
        sender_name,
        sender_email,
        user_id,
        message
    } = req.body;

    if (!['house', 'car'].includes(contact_type)) {
        return res.status(400).json({ error: 'Invalid contact type' });
    }

    const query = `
      INSERT INTO contacts 
        (contact_type, house_id, car_id, sender_name, sender_email, user_id, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            contact_type,
            house_id || null,
            car_id || null,
            sender_name,
            sender_email,
            user_id,
            message
        ],
        (err, result) => {
            if (err) {
                console.error('Error inserting contact:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'Contact message sent successfully!' });
        }
    );
};


  

// GET /api/contacts
export const getAllContacts = (req, res) => {
    db.query('SELECT * FROM contacts ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('Error fetching contacts:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
};


export const ownersInboxes=(req,res)=>{
    const { userid } =req.params;
    db.query('select * from contacts where user_id=? order by created_at desc ', userid,(err,result)=>{
      if (err) {
            console.error('Error fetching contacts:', err);
            return res.status(500).json({ error: err });
        }
        res.status(200).json(result)
    })
}