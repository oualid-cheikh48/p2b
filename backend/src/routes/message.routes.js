const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messagerie entre utilisateurs
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Lister tous les messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des messages
 */
router.get("/", authMiddleware, messageController.getMessages);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Envoyer un message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sender_id, receiver_id, content]
 *             properties:
 *               sender_id:
 *                 type: integer
 *                 example: 1
 *               receiver_id:
 *                 type: integer
 *                 example: 2
 *               property_id:
 *                 type: integer
 *                 example: 3
 *               content:
 *                 type: string
 *                 example: Bonjour, le logement est-il disponible ?
 *     responses:
 *       201:
 *         description: Message envoyé
 *       500:
 *         description: Erreur serveur
 */
router.post("/", authMiddleware, messageController.sendMessage);

module.exports = router;
