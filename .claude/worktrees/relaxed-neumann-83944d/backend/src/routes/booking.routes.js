const express = require("express");

const router = express.Router();

const bookingController = require("../controllers/booking.controller");

const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get(
  "/",
  bookingController.getAllBookings
);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post(
  "/",
  authMiddleware,
  bookingController.createBooking
);

module.exports = router;