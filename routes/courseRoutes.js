// const express = require("express");
// const {
//   getAllCourses,
//   createCourse,
//   updateCourse,
//   deleteCourse,
// } = require("../controllers/courseController");
// const { checkAuth, checkRole } = require("../middlewares/auth");
// const router = express.Router();

// /**
//  * @swagger
//  * /courses:
//  *   post:
//  *     summary: Create a new course (Author only)
//  *     tags:
//  *       - Courses
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *               videos:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *     responses:
//  *       201:
//  *         description: Course created successfully
//  *       403:
//  *         description: Unauthorized
//  */

// /**
//  * @swagger
//  * /courses:
//  *   get:
//  *     summary: Get all courses
//  *     tags:
//  *       - Courses
//  *     responses:
//  *       200:
//  *         description: List of courses
//  *       500:
//  *         description: Server error
//  */

// /**
//  * @swagger
//  * /courses/{id}:
//  *   put:
//  *     summary: Update an existing course (Author only)
//  *     tags:
//  *       - Courses
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Course ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *               videos:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *     responses:
//  *       200:
//  *         description: Course updated successfully
//  *       403:
//  *         description: Unauthorized
//  *       404:
//  *         description: Course not found
//  */

// /**
//  * @swagger
//  * /courses/{id}:
//  *   delete:
//  *     summary: Delete a course (Author only)
//  *     tags:
//  *       - Courses
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Course ID
//  *     responses:
//  *       200:
//  *         description: Course deleted successfully
//  *       403:
//  *         description: Unauthorized
//  *       404:
//  *         description: Course not found
//  */

// router.get("/", getAllCourses);
// router.post("/", checkAuth, checkRole("author"), createCourse);
// router.put("/:id", checkAuth, checkRole("author"), updateCourse);
// router.delete("/:id", checkAuth, checkRole("author"), deleteCourse);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { checkAuth, checkRole } = require("../middlewares/auth");

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
router.get("/", getCourses);
router.post("/", checkAuth, checkRole("author"), createCourse);
router.put("/:id", checkAuth, checkRole("author"), updateCourse);
router.delete("/:id", checkAuth, checkRole("author"), deleteCourse);

module.exports = router;
