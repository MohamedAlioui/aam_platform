import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, upload.fields([{ name: 'images', maxCount: 5 }]), createProduct);
router.put('/:id', protect, adminOnly, upload.fields([{ name: 'images', maxCount: 5 }]), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
