const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notifications utilisateur
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Lister les notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications
 */
router.get("/", authMiddleware, notificationController.getNotifications);

module.exports = router;
