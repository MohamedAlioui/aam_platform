import Course from '../models/Course.js';

// @desc   Get all courses
// @route  GET /api/courses
// @access Public
export const getCourses = async (req, res) => {
  try {
    const { category, level, featured } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (featured === 'true') filter.featured = true;

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, courses, total: courses.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single course
// @route  GET /api/courses/:id
// @access Public
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create course
// @route  POST /api/courses
// @access Admin
export const createCourse = async (req, res) => {
  try {
    const courseData = { ...req.body };
    if (req.file) courseData.image = `/uploads/courses/${req.file.filename}`;

    const course = await Course.create(courseData);
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update course
// @route  PUT /api/courses/:id
// @access Admin
export const updateCourse = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/courses/${req.file.filename}`;

    const course = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete course
// @route  DELETE /api/courses/:id
// @access Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
