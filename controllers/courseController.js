const Course = require("../models/courseModel");
const Section = require("../models/sectionModel");

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
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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

    // Fetch associated sections
    const sections = await Section.find({ courseId: id });

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
