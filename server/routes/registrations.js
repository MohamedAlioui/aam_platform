import express from 'express';
import { registerForCourse, getMyRegistrations, getAllRegistrations, updateRegistration } from '../controllers/registrationController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, registerForCourse);
router.get('/my', protect, getMyRegistrations);
router.get('/', protect, adminOnly, getAllRegistrations);
router.put('/:id', protect, adminOnly, updateRegistration);

export default router;
