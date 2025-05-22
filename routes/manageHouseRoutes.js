import express from 'express';
import {
    getHouses,
    getStats,
    deleteHouse, approveHouse,
    updateStatus, rejectHouse
} from '../controllers/manageHouseController.js';

const router = express.Router();

router.get('/managehouses', getHouses);
router.get('/managehouses/stats', getStats);
router.delete('/managehouses/:id', deleteHouse);
router.patch('/managehouses/:id/status', updateStatus);
// Approve a house
router.patch('/managehouses/:id/approve', approveHouse);


// Reject a house
router.patch('/managehouses/:id/reject', rejectHouse);

// Delete a house
router.delete('/managehouses/:id', deleteHouse);


export default router;
