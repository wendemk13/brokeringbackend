import db from "../db.js";
export const getAllReplies = (req, res) => {
    const query = "select * from replies";
    db.query(query, (err, data) => {
        if (err) res.json({ "error": err })
        if (data.length === 0) {
            res.json({ "replies": "No Replies Found" })
        } else {
            res.json({ "replies": data });
        }

    })
}


export const getFeedbackReplies = (req, res) => {
    const { id } = req.params;
    const query = "select * from replies where feedback_id=?"
    db.query(query, [id], (err, data) => {
        if (err) { res.json({ "error": err }) };
        if (data.length === 0) { res.json({ "replies": "No Replies Found." }) };
        res.json({ "replies": data })
    })
}


export const sendReply = (req, res) => {
    const { feedbackid, adminid } = req.params;
    const { message } = req.body;
    const query = "insert into replies (feedback_id,admin_id,message) values (?,?,?)  ";
    db.query(query, [feedbackid, adminid, message], (err, data) => {
        if (err) res.json({ "error": err })
        if (data) res.json({ "reply": data })
    })
}