import express from 'express';
import { getImages, uploadImage, updateImage, deleteImage } from '../controllers/galleryController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getImages);
router.post('/', protect, adminOnly, upload.single('image'), uploadImage);
router.put('/:id', protect, adminOnly, updateImage);
router.delete('/:id', protect, adminOnly, deleteImage);

export default router;
