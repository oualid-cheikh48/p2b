const router = require("express").Router();
const controller = require("../controllers/property.controller");

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

module.exports = router;