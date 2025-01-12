const Section = require("../models/sectionModel");
const Course = require("../models/courseModel");

/**
 * Add a new section to a course
 */
exports.addSection = async (req, res) => {
  try {
    const { courseId, headline, description, videos } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create the new section in the Section collection
    const newSection = await Section.create({
      courseId,
      headline,
      description,
      videos,
    });

    // Embed the section in the course document
    const embeddedSection = {
      _id: newSection._id,
      headline: newSection.headline,
      description: newSection.description,
      videos: newSection.videos,
    };
    course.sections.push(embeddedSection);

    // Save the course
    await course.save();

    res.status(201).json({
      message: "Section added successfully",
      course,
      section: newSection,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Update a section in both Course and Section collections
 */
exports.updateSection = async (req, res) => {
  try {
    const { sectionId, courseId, headline, description, videos } = req.body;

    // Find and update the section in the Section collection
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { headline, description, videos },
      { new: true }
    );

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Find the course and update the embedded section
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const embeddedSection = course.sections.id(sectionId);
    if (!embeddedSection) {
      return res.status(404).json({ message: "Section not found in course" });
    }

    // Update the embedded section
    embeddedSection.headline = headline || embeddedSection.headline;
    embeddedSection.description = description || embeddedSection.description;
    embeddedSection.videos = videos || embeddedSection.videos;

    // Save the course
    await course.save();

    res.status(200).json({
      message: "Section updated successfully",
      section,
      course,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all sections for a specific course
 */
exports.getSectionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find all sections for the course
    const sections = await Section.find({ courseId });
    if (!sections.length) {
      return res
        .status(404)
        .json({ message: "No sections found for this course" });
    }

    res.status(200).json({ sections });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Delete a section from a course
 */
exports.deleteSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Remove the section
    course.sections = course.sections.filter(
      (section) => section._id.toString() !== sectionId
    );

    // Save the course without the deleted section
    await course.save();

    res.status(200).json({ message: "Section deleted successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Upload a video and associate it with a section
 */
exports.uploadVideo = async (req, res) => {
  try {
    const { sectionId, title, time } = req.body;

    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const url = req.file.path; // Local file path

    // Find the section and add the video
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const newVideo = { title, time, url };
    section.videos.push(newVideo);

    // Save the updated section
    await section.save();

    res.status(201).json({
      message: "Video uploaded and added to section successfully",
      section,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
