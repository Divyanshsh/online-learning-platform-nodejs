const Review = require("../models/reviewModel");
const Course = require("../models/courseModel");

/**
 * Add a review for a course
 */
exports.addReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the learner has already reviewed this course
    const existingReview = await Review.findOne({
      courseId,
      userId: req.user.id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this course" });
    }

    // Create a new review
    const review = await Review.create({
      courseId,
      userId: req.user.id,
      rating,
      comment,
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Update a review
 */
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params; // Review ID
    const { rating, comment } = req.body;

    // Find the review
    const review = await Review.findOne({ _id: id, userId: req.user.id });
    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found or not owned by you" });
    }

    // Update the review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Delete a review
 */
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params; // Review ID

    // Find the review
    const review = await Review.findOne({ _id: id, userId: req.user.id });
    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found or not owned by you" });
    }

    // Delete the review
    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * get course reviews review
 */
exports.getCourseReviews = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 5 } = req.query; // Default: page 1, 5 reviews per page

  try {
    const reviews = await Review.find({ course: id })
      .populate()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const totalReviews = await Review.countDocuments({ course: id });

    res.json({
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: Number(page),
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve reviews" });
  }
};
