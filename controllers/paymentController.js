import axios from 'axios';
import db from '../db.js';
// export const verifyPayment = async (req, res) => {
//     try {
//         const { txRef } = req.params;

//         const chapaRes = await axios.get(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
//             headers: {
//                 Authorization: 'Bearer CHASECK_TEST-oL1W2OPGTeIeq53E6oJtLKabV9GsAQ67',
//             },
//         });

//         res.json(chapaRes.data);
//     } catch (err) {
//         console.error('Error verifying payment:', err);
//         res.status(500).json({ error: 'Failed to verify payment' });
//     }
// };


import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { error } from 'console';

// For __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// export const verifyPayment = async (req, res) => {
//   try {
//     const { txRef } = req.params;

//     // Fetch payment details from Chapa API
//     const chapaRes = await axios.get(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
//       headers: {
//         Authorization: 'Bearer CHASECK_TEST-oL1W2OPGTeIeq53E6oJtLKabV9GsAQ67',
//       },
//     });
//     res.json(chapaRes.data);

//     if (chapaRes.data.status === 'success') {
//       const paymentData = chapaRes.data.data;

//       // Create receipts folder if it doesn't exist
//       const receiptsDir = path.join(__dirname, 'receipts');
//       if (!fs.existsSync(receiptsDir)) {
//         fs.mkdirSync(receiptsDir);
//       }

//       // Create a PDF document
//       const doc = new PDFDocument();
//       const filePath = path.join(receiptsDir, `receipt_${txRef}.pdf`);

//       // Pipe the PDF to a file
//       const writeStream = fs.createWriteStream(filePath);
//       doc.pipe(writeStream);

//       // Add content to the PDF
//       doc.fontSize(18).text('Payment Receipt', { align: 'center' });
//       doc.moveDown();
//       doc.fontSize(12).text(`Transaction Reference: ${paymentData.tx_ref}`);
//       doc.text(`Amount: ${paymentData.amount} ${paymentData.currency}`);
//       doc.text(`Status: ${paymentData.status}`);
//       doc.text(`Name: ${paymentData.first_name} ${paymentData.last_name}`);
//       doc.text(`Email: ${paymentData.email}`);
//       doc.text(`Date: ${new Date(paymentData.created_at).toLocaleString()}`);

//       // Finalize the PDF
//       doc.end();

//       // Wait for PDF write stream to finish
//       writeStream.on('finish', () => {
//         res.sendFile(filePath, (err) => {
//           if (err) {
//             console.error('Error sending PDF:', err);
//             res.status(500).json({ error: 'Failed to send receipt PDF' });
//           }
//         });
//       });

//       writeStream.on('error', (err) => {
//         console.error('Error writing PDF:', err);
//         res.status(500).json({ error: 'Failed to generate receipt PDF' });
//       });
//     } else {
//       res.status(400).json({ error: 'Payment verification failed' });
//     }
//   } catch (err) {
//     console.error('Error verifying payment:', err);
//     res.status(500).json({ error: 'Failed to verify payment' });
//   }
// };




export const verifyPayment = async (req, res) => {
  try {
    const { txRef } = req.params;

    const chapaRes = await axios.get(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
      headers: {
        Authorization: 'Bearer CHASECK_TEST-oL1W2OPGTeIeq53E6oJtLKabV9GsAQ67',
      },
    });

    if (chapaRes.data.status === 'success') {
      // You can store to DB here if needed
      res.status(200).json(chapaRes.data);
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};


export const getAllTransactions = (req, res) => {
  const query = "select * from payments"
  db.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "error fectching all transactions", error: err.message })
      return res.status(500).json({ message: 'Error creating house', error: err.message });

    }
    if (result) {
      return res.status(200).json({ transactions: result })
    }
  })
}
export const storePayment = (req, res) => {
  try {
    const { tx_ref, amount, currency, status, user_id } = req.body;

    if (!tx_ref || !amount || !currency || !status || !user_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Step 1: Check if tx_ref already exists
    const checkSql = 'SELECT * FROM payments WHERE tx_ref = ?';
    db.query(checkSql, [tx_ref], (checkErr, checkResult) => {
      if (checkErr) {
        console.error(checkErr);
        return res.status(500).json({ message: 'Database error while checking tx_ref' });
      }

      if (checkResult.length > 0) {
        // tx_ref already exists
        return res.status(400).json({ message: 'Duplicate tx_ref. This reference already exists.' });
      }

      // Step 2: If not exists, insert the payment
      const insertSql = 'INSERT INTO payments (tx_ref, amount, currency, status, user_id) VALUES (?, ?, ?, ?, ?)';
      const values = [tx_ref, amount, currency, status, user_id];

      db.query(insertSql, values, (insertErr, result) => {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ message: 'Failed to save payment' });
        }

        return res.status(201).json({
          message: 'Payment saved successfully',
          payment_id: result.insertId
        });
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


export const getPaymentHistory = (req, res) => {
  try {
    const { user_id } = req.params;

    const sql = 'SELECT * FROM payments WHERE user_id = ? ';

    db.query(sql, [user_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch payment history' });
      }

      res.json(results)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


export const downloadReceipt = async (req, res) => {
  try {
    const { txRef, amount } = req.params;

    const paymentData = {
      // amount: 120,
      currency: "ETB",
      status: "success",
      tx_ref: txRef,
      created_at: new Date().toISOString(),
    };

    const doc = new PDFDocument();

    // Handle errors from the PDF stream
    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Failed to generate PDF' });
      }
    });

    // Set headers
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${txRef}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    // Pipe the PDF stream to response
    doc.pipe(res);

    doc.fontSize(20).text('Payment Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Transaction Reference: ${paymentData.tx_ref}`);
    doc.text(`Amount Paid: ${paymentData.amount} ${paymentData.currency}`);
    doc.text(`Status: ${paymentData.status}`);
    doc.text(`Date: ${new Date(paymentData.created_at).toLocaleString()}`);
    doc.moveDown();
    doc.text('Thank you for your payment.', { align: 'center' });

    doc.end();

  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate receipt' });
    }
  }
};





// export const createPaymentHistory = async (req, res) => {
//   try {
//     const { tx_ref, amount, currency, status, user_id } = req.body;

//     // Validate input
//     if (!tx_ref || !amount || !currency || !status || !user_id) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Insert into payments table
//     const query = `
//       INSERT INTO payments (tx_ref, amount, currency, status, user_id, created_at)
//       VALUES (?, ?, ?, ?, ?, NOW())
//     `;

//     await db.query(query, [tx_ref, amount, currency, status, user_id]);

//     res.status(201).json({ message: 'Payment history created successfully' });
//   } catch (error) {
//     console.error('Error creating payment history:', error);
//     res.status(500).json({ message: 'Failed to create payment history' });
//   }
// };
