const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Gestion des avis
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Lister tous les avis
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Liste des avis
 */
router.get("/", reviewController.getAllReviews);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Publier un avis
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reviewer_id, property_id, rating]
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 example: 1
 *               reviewer_id:
 *                 type: integer
 *                 example: 1
 *               property_id:
 *                 type: integer
 *                 example: 2
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent séjour, très propre !
 *     responses:
 *       201:
 *         description: Avis publié
 *       500:
 *         description: Erreur serveur
 */
router.post("/", authMiddleware, reviewController.createReview);

module.exports = router;
