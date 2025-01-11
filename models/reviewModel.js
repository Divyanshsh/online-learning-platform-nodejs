// const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema({
//   content: String,
//   rating: Number,
//   course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// });

// module.exports = mongoose.model("Review", reviewSchema);

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
