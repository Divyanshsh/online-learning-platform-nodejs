// const express = require("express");
// const { addReview } = require("../controllers/reviewController");
// const { checkAuth, checkRole } = require("../middlewares/auth");
// const router = express.Router();

// /**
//  * @swagger
//  * /reviews/{id}:
//  *   post:
//  *     summary: Add a review for a course (Learner only)
//  *     tags:
//  *       - Reviews
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               courseId:
//  *                 type: string
//  *               rating:
//  *                 type: integer
//  *                 minimum: 1
//  *                 maximum: 5
//  *               comment:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Review added successfully
//  *       403:
//  *         description: Unauthorized
//  *       404:
//  *         description: Course not found
//  */

// router.post("reviews/:id", checkAuth, checkRole("learner"), addReview);

// module.exports = router;

const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/auth");

// Add a review
/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Add a review for a course (Learner only)
 *     tags:
 *       - Reviews
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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: You have already reviewed this course
 *       404:
 *         description: Course not found
 */
router.post(
  "/",
  authMiddleware.checkAuth,
  authMiddleware.checkRole("learner"),
  reviewController.addReview
);

// Update a review
/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review (Learner only)
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found or not owned by you
 */
router.put(
  "/:id",
  authMiddleware.checkAuth,
  authMiddleware.checkRole("learner"),
  reviewController.updateReview
);

// Delete a review
/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review (Learner only)
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found or not owned by you
 */
router.delete(
  "/:id",
  authMiddleware.checkAuth,
  authMiddleware.checkRole("learner"),
  reviewController.deleteReview
);

module.exports = router;
