const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Gestion des paiements
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Lister tous les paiements
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des paiements
 */
router.get("/", authMiddleware, paymentController.getPayments);

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Créer un paiement
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [booking_id, amount, payment_method]
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 595.00
 *               payment_method:
 *                 type: string
 *                 example: card
 *               transaction_id:
 *                 type: string
 *                 example: TXN_ABC123
 *     responses:
 *       201:
 *         description: Paiement créé
 *       500:
 *         description: Erreur serveur
 */
router.post("/", authMiddleware, paymentController.createPayment);

module.exports = router;
