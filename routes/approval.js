import express from 'express';
import { getPendingHouses, getPendingCars, approveHouse, approveCar, rejectCar, rejectHouse, getPendingListings } from '../controllers/approvalController.js';

const router = express.Router();


router.get('/getPendingHouses', getPendingHouses);
router.get('/getPendingCars', getPendingCars);
router.get('/getPendingListings', getPendingListings);
router.post('/approveHouse/:id', approveHouse);
router.post('/approveCar/:id', approveCar);

router.put('/house/:id/reject', rejectHouse);
router.put('/car/:id/reject', rejectCar);



export default router;
