import express from 'express';
import { getImages, uploadImage, updateImage, deleteImage } from '../controllers/galleryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/',     getImages);
router.post('/',    protect, adminOnly, uploadImage);  // expects JSON body with url
router.put('/:id',  protect, adminOnly, updateImage);
router.delete('/:id', protect, adminOnly, deleteImage);

export default router;
