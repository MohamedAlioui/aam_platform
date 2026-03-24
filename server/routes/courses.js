import express from 'express';
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', protect, adminOnly, upload.single('image'), createCourse);
router.put('/:id', protect, adminOnly, upload.single('image'), updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

export default router;
