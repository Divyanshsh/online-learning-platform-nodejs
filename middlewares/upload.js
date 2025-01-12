const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const videoPath = process.env.VIDEO_STORAGE_PATH || "./uploads/videos";

    // Ensure directory exists
    if (!fs.existsSync(videoPath)) {
      fs.mkdirSync(videoPath, { recursive: true }); // Create folder recursively
    }

    cb(null, videoPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Filter to accept only video files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".mp4" || ext === ".mov" || ext === ".avi") {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"), false);
  }
};

// Configure Multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // Set file size limit (e.g., 500 MB)
});

module.exports = upload;
