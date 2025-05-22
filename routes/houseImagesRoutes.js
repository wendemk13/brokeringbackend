import express from 'express';
import {
    getAllImages,
    getImagesByHouseId,
    getMainImage,
    getHelperImages,
    addImage,
    deleteImage
} from '../controllers/houseImagesController.js';

const router = express.Router();

router.get('/', getAllImages);
router.get('/house/:houseid', getImagesByHouseId);
router.get('/house/:houseid/main', getMainImage);
router.get('/house/:houseid/helpers', getHelperImages);
router.post('/', addImage);
router.delete('/:id', deleteImage);

export default router;
