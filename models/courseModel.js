const mongoose = require("mongoose");

// Define the video schema for sections
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  url: { type: String, required: true },
});

// Define the section schema
const sectionSchema = new mongoose.Schema({
  headline: { type: String, required: true },
  description: { type: String, required: true },
  videos: [videoSchema], // Array of video objects
});

// Define the course schema
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sections: [sectionSchema], // Embed section schema directly
    enrolledLearners: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        email: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
