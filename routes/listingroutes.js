
import express from 'express';
import { getAllListings, getTotalListings, getUserCars, getUserHouses, deleteUserListing, updateUserListing } from '../controllers/listingcontrollers.js';

const router = express.Router();


// Get all listings
router.get('/my-listings', getAllListings);
router.get('/totallistings', getTotalListings);
router.get('/usercars', getUserCars);
router.get('/userhouses', getUserHouses);
router.delete('/deletelisting',deleteUserListing);
router.put('updatelisting',updateUserListing);

export default router;
