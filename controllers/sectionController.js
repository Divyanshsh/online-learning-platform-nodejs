// const Section = require("../models/sectionModel");
// const Course = require("../models/courseModel");

// /**
//  * Add a section with videos to a course
//  */
// exports.addSection = async (req, res) => {
//   try {
//     const { courseId, headline, description, videos } = req.body;

//     // Check if the course exists
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Validate videos array
//     if (!Array.isArray(videos) || videos.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Videos array must not be empty" });
//     }

//     // Create a new section
//     const section = await Section.create({
//       courseId,
//       headline,
//       description,
//       videos,
//     });

//     res.status(201).json({ message: "Section added successfully", section });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /**
//  * Get all sections for a specific course
//  */
// exports.getSectionsByCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;

//     // Find all sections for the course
//     const sections = await Section.find({ courseId });
//     if (!sections.length) {
//       return res
//         .status(404)
//         .json({ message: "No sections found for this course" });
//     }

//     res.status(200).json({ sections });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /**
//  * Update a section
//  */
// exports.updateSection = async (req, res) => {
//   try {
//     const { id } = req.params; // Section ID
//     const { headline, description, videos } = req.body;

//     // Find and update the section
//     const section = await Section.findByIdAndUpdate(
//       id,
//       { headline, description, videos },
//       { new: true }
//     );

//     if (!section) {
//       return res.status(404).json({ message: "Section not found" });
//     }

//     res.status(200).json({ message: "Section updated successfully", section });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /**
//  * Delete a section
//  */
// exports.deleteSection = async (req, res) => {
//   try {
//     const { id } = req.params; // Section ID

//     // Find and delete the section
//     const section = await Section.findByIdAndDelete(id);
//     if (!section) {
//       return res.status(404).json({ message: "Section not found" });
//     }

//     res.status(200).json({ message: "Section deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const Section = require("../models/sectionModel");
const Course = require("../models/courseModel");

/**
 * Add a new section to a course
 */
// exports.addSection = async (req, res) => {
//   try {
//     const { courseId, headline, description, videos } = req.body;

//     // Find the course
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Add the section
//     const newSection = { headline, description, videos };
//     course.sections.push(newSection);

//     // Save the course with the new section
//     await course.save();

//     res.status(201).json({ message: "Section added successfully", course });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
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

// exports.updateSection = async (req, res) => {
//   try {
//     const { courseId, sectionId, headline, description, videos } = req.body;

//     // Find the course
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Find the section to update
//     const section = course.sections.id(sectionId);
//     if (!section) {
//       return res.status(404).json({ message: "Section not found" });
//     }

//     // Update section details
//     section.headline = headline || section.headline;
//     section.description = description || section.description;
//     section.videos = videos || section.videos;

//     // Save the course with the updated section
//     await course.save();

//     res.status(200).json({ message: "Section updated successfully", course });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

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
