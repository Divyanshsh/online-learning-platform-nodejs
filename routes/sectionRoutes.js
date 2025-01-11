const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");
const authMiddleware = require("../middlewares/auth");

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

module.exports = router;
