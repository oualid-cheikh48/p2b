const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Gestion des réservations
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Lister toutes les réservations
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Liste des réservations
 */
router.get("/", bookingController.getAllBookings);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Créer une réservation
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guest_id, property_id, start_date, end_date, total_price]
 *             properties:
 *               guest_id:
 *                 type: integer
 *                 example: 1
 *               property_id:
 *                 type: integer
 *                 example: 2
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-07"
 *               total_price:
 *                 type: number
 *                 example: 595.00
 *     responses:
 *       201:
 *         description: Réservation créée
 *       500:
 *         description: Erreur serveur
 */
router.post("/", authMiddleware, bookingController.createBooking);
router.put("/:id", authMiddleware, bookingController.updateBooking);

module.exports = router;
