import Registration from '../models/Registration.js';
import Course from '../models/Course.js';

// @desc   Register for a course
// @route  POST /api/registrations
// @access Private
export const registerForCourse = async (req, res) => {
  try {
    const { courseId, message } = req.body;

    // Check course exists and has seats
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (course.availableSeats <= 0) {
      return res.status(400).json({ success: false, message: 'No seats available' });
    }

    // Check if already registered
    const existing = await Registration.findOne({ userId: req.user._id, courseId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already registered for this course' });
    }

    const registration = await Registration.create({
      userId: req.user._id,
      courseId,
      message
    });

    // Increment enrolled count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    // Populate for response
    await registration.populate(['userId', 'courseId']);

    // Emit socket event to admin room
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('new_registration', {
        type: 'registration',
        message: `New registration: ${registration.userId.name} → ${registration.courseId.title_fr}`,
        registration
      });
    }

    res.status(201).json({ success: true, registration });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Already registered for this course' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get my registrations
// @route  GET /api/registrations/my
// @access Private
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate('courseId')
      .sort({ createdAt: -1 });
    res.json({ success: true, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all registrations (admin)
// @route  GET /api/registrations
// @access Admin
export const getAllRegistrations = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const registrations = await Registration.find(filter)
      .populate('userId', 'name email phone')
      .populate('courseId', 'title_ar title_fr price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Registration.countDocuments(filter);
    res.json({ success: true, registrations, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update registration status (admin)
// @route  PUT /api/registrations/:id
// @access Admin
export const updateRegistration = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true }
    ).populate('userId courseId');

    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.json({ success: true, registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
