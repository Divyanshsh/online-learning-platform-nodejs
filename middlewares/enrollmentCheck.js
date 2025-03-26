const Course = require("../models/courseModel");

const checkEnrollment = async (req, res, next) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    if (!course.enrolledLearners.includes(req.user.id)) {
      return res
        .status(403)
        .json({ error: "Access denied. Please enroll first." });
    }
    next(); // Allow access if enrolled
  } catch (error) {
    res.status(500).json({ error: "Error checking enrollment" });
  }
};

module.exports = { checkEnrollment };
