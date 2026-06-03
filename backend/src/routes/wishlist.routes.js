const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Logements favoris
 */

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Lister les favoris
 *     tags: [Wishlist]
 *     responses:
 *       200:
 *         description: Liste des favoris
 */
router.get("/", wishlistController.getWishlist);

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Ajouter un logement aux favoris
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, property_id]
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               property_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Ajouté aux favoris
 *       500:
 *         description: Erreur serveur
 */
router.post("/", authMiddleware, wishlistController.addToWishlist);

/**
 * @swagger
 * /wishlist/{id}:
 *   delete:
 *     summary: Retirer un logement des favoris
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retiré des favoris
 *       404:
 *         description: Favori introuvable
 */
router.delete("/:id", authMiddleware, wishlistController.removeFromWishlist);

module.exports = router;
