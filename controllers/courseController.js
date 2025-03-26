const Course = require("../models/courseModel");
const Section = require("../models/sectionModel");
const User = require("../models/userModel");

/**
 * Create a course
 */
exports.createCourse = async (req, res) => {
  try {
    const { title, description, authorId } = req.body;

    // Create a new course
    const course = await Course.create({
      title,
      description,
      authorId,
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all courses
 */
// exports.getCourses = async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.status(200).json({ courses });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
exports.getCourses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default: page 1, 10 courses per page

  try {
    const courses = await Course.find()
      .populate("title")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const totalCourses = await Course.countDocuments();

    res.json({
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: Number(page),
      courses,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve courses" });
  }
};

/**
 * Get a course with sections
 */
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch course details
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    console.log(course);
    // Fetch associated sections
    const sections = await Section.find({ courseId: id });
    console.log(sections);
    res.status(200).json({ course, sections });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Update a course
 */
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Find and update the course
    const course = await Course.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Delete a course and its sections
 */
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find and delete the course
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res
      .status(200)
      .json({ message: "Course and its sections deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Enroll a learner in a course
 */
exports.enrollInCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if user is already enrolled
    const isEnrolled = course.enrolledLearners.some((enrollment) =>
      enrollment.userId.equals(userId)
    );
    if (isEnrolled) {
      return res.status(400).json({ error: "Already enrolled" });
    }

    // Fetch full user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Store full user details in enrollment
    course.enrolledLearners.push({
      userId: user._id,
      name: user.name,
      email: user.email,
    });

    await course.save();

    res.status(200).json({
      message: "Enrolled successfully",
      enrolledUser: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Enrollment failed" });
  }
};

/**
 * Get all enrolled courses for the learner
 */
exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      "enrolledLearners.userId": req.user.id,
    });

    res.status(200).json({ enrolledCourses: courses });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve courses" });
  }
};
