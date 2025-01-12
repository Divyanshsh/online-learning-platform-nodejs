// ** AWS storage for future use **
// // Upload video and add to section
// router.post('/upload-video', upload.single('video'), async (req, res) => {
//     try {
//         const { sectionId, title, time } = req.body;

//         // Validate inputs
//         if (!sectionId || !title || !time || !req.file) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // Find the section
//         const section = await Section.findById(sectionId);
//         if (!section) {
//             return res.status(404).json({ message: 'Section not found' });
//         }

//         // Add the video to the section
//         const video = {
//             title,
//             time,
//             url: req.file.location, // AWS S3 URL
//         };
//         section.videos.push(video);
//         await section.save();

//         res.status(201).json({ message: 'Video uploaded and added to section successfully', section });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// module.exports = router;
// ** AWS storage for future use **

const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Add a section to a course
/**
 * @swagger
 * /sections:
 *   post:
 *     summary: Add a new section to a course (Author only)
 *     tags:
 *       - Sections
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *               headline:
 *                 type: string
 *               description:
 *                 type: string
 *               videos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     time:
 *                       type: string
 *                     url:
 *                       type: string
 *     responses:
 *       201:
 *         description: Section added successfully
 *       404:
 *         description: Course not found
 */
router.post(
  "/",
  authMiddleware.checkAuth,
  authMiddleware.checkRole("author"),
  sectionController.addSection
);

// Get all sections for a specific course
/**
 * @swagger
 * /sections/{courseId}:
 *   get:
 *     summary: Get all sections for a specific course
 *     tags:
 *       - Sections
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: List of sections
 *       404:
 *         description: No sections found for this course
 */
router.get(
  "/:courseId",
  authMiddleware.checkAuth,
  sectionController.getSectionsByCourse
);

// Update a section
/**
 * @swagger
 * /sections/{id}:
 *   put:
 *     summary: Update a section (Author only)
 *     tags:
 *       - Sections
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               headline:
 *                 type: string
 *               description:
 *                 type: string
 *               videos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     time:
 *                       type: string
 *                     url:
 *                       type: string
 *     responses:
 *       200:
 *         description: Section updated successfully
 *       404:
 *         description: Section not found
 */
router.put(
  "/:id",
  authMiddleware.checkAuth,
  authMiddleware.checkRole("author"),
  sectionController.updateSection
);

// Delete a section
/**
 * @swagger
 * /sections/{id}:
 *   delete:
 *     summary: Delete a section from a course (Author only)
 *     tags:
 *       - Sections
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *     responses:
 *       200:
 *         description: Section deleted successfully
 *       404:
 *         description: Section not found
 */
router.delete(
  "/:id",
  authMiddleware.checkAuth,
  authMiddleware.checkRole("author"),
  sectionController.deleteSection
);

// Upload a video and link it to a section
/**
 * @swagger
 * /sections/upload-video:
 *   post:
 *     summary: Upload a video and link it to a section (Author only)
 *     description: Allows authors to upload a video file and associate it with a specific section of a course.
 *     tags:
 *       - Sections
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               sectionId:
 *                 type: string
 *                 description: The ID of the section to associate the video with.
 *               title:
 *                 type: string
 *                 description: Title of the video.
 *               time:
 *                 type: string
 *                 description: Duration of the video (e.g., "10:25").
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: The video file to upload.
 *             required:
 *               - sectionId
 *               - title
 *               - time
 *               - video
 *     responses:
 *       201:
 *         description: Video uploaded and added to the section successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Video uploaded and added to section successfully
 *                 section:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64b2c3f4f5a2d73468e4a002
 *                     headline:
 *                       type: string
 *                       example: Introduction
 *                     description:
 *                       type: string
 *                       example: Learn the basics of the course.
 *                     videos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: Welcome Video
 *                           time:
 *                             type: string
 *                             example: 10:25
 *                           videoFilePath:
 *                             type: string
 *                             example: ./uploads/videos/1694346123456-welcome.mp4
 *       400:
 *         description: Bad request or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No video file uploaded
 *       404:
 *         description: Section not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Section not found
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: string
 *                   example: Some error occurred
 */
router.post(
  "/upload-video",
  authMiddleware.checkAuth,
  authMiddleware.checkRole("author"),
  upload.single("video"), // Use Multer for single file upload
  sectionController.uploadVideo
);

module.exports = router;
