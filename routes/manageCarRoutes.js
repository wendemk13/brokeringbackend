import express from 'express';
import {
    getCars,
    getCarStats,
    deleteCar,
    approveCar,
    updateCarStatus,
    rejectCar
} from '../controllers/manageCarController.js';

const router = express.Router();

router.get('/managecars', getCars);
router.get('/managecars/stats', getCarStats);
router.delete('/managecars/:id', deleteCar);
router.patch('/managecars/:id/status', updateCarStatus);
router.patch('/managecars/:id/approve', approveCar);
router.patch('/managecars/:id/reject', rejectCar);

export default router;
