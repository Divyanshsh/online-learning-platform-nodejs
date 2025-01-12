// ** AWS storage for future use **
// const AWS = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');

// // AWS S3 configuration
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
// });

// // Multer configuration for S3
// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.S3_BUCKET_NAME,
//         acl: 'public-read', // Set access control (e.g., public-read)
//         key: (req, file, cb) => {
//             const uniqueName = `${Date.now()}-${file.originalname}`;
//             cb(null, `videos/${uniqueName}`); // Save files in the 'videos/' folder
//         },
//     }),
//     limits: { fileSize: 500 * 1024 * 1024 }, // Limit file size to 500MB
//     fileFilter: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         if (['mp4', 'mov', 'avi'].includes(ext)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only video files are allowed!'), false);
//         }
//     },
// });

// module.exports = upload;
// ** AWS storage for future use **

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
