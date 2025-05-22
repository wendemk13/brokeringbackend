import express from 'express';
const router = express.Router();
import { verifyPayment, storePayment, getPaymentHistory, getAllTransactions, downloadReceipt } from '../controllers/paymentController.js';

// Route: GET /api/payment/verify/:txRef
router.get('/verify/:txRef', verifyPayment);
router.post('/store', storePayment);
router.get('/history/:user_id', getPaymentHistory);

router.get('/alltransactions', getAllTransactions);

router.get('/receipt/:txRef', downloadReceipt);




export default router;
