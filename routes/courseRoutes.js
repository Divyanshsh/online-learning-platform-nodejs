const express = require("express");
const router = express.Router();
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
  enrollInCourse,
  getEnrolledCourses,
} = require("../controllers/courseController");
const { checkAuth, checkRole } = require("../middlewares/auth");
const { checkEnrollment } = require("../middlewares/enrollmentCheck");

// Create a course
/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course (Author only)
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               authorId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *       500:
 *         description: Server error
 */

// Get all courses
/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags:
 *       - Courses
 *     responses:
 *       200:
 *         description: List of courses
 *       500:
 *         description: Server error
 */

// Get a course with its sections
/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course details along with sections
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course with sections
 *       404:
 *         description: Course not found
 */

// Update a course
/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course (Author only)
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 */

// Delete a course and its sections
/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course and its sections (Author only)
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course and its sections deleted successfully
 *       404:
 *         description: Course not found
 */

// enroll course
/**
 * @swagger
 * /courses/{id}/enroll:
 *   post:
 *     summary: Enroll a learner in a course
 *     description: Learners must enroll in a course before accessing its content.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to enroll in
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully enrolled in the course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Enrolled successfully"
 *       400:
 *         description: Already enrolled
 *       403:
 *         description: Access denied
 *       404:
 *         description: Course not found
 *       500:
 *         description: Enrollment failed
 */

// get enrolled courses
/**
 * @swagger
 * /courses/enrolled:
 *   get:
 *     summary: Get all enrolled courses of the learner
 *     description: Fetches a list of courses that the learner has enrolled in.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled courses
 *       403:
 *         description: Access denied
 *       500:
 *         description: Failed to retrieve courses
 */

router.get("/", checkAuth, getCourses);
router.get("/:id", checkAuth, getCourseById);
router.post("/", checkAuth, checkRole("author"), createCourse);
router.put("/:id", checkAuth, checkRole("author"), updateCourse);
router.delete("/:id", checkAuth, checkRole("author"), deleteCourse);
router.get("/enrolled", checkAuth, checkRole("learner"), getEnrolledCourses);
router.post("/:id/enroll", checkAuth, checkRole("learner"), enrollInCourse);

module.exports = router;
