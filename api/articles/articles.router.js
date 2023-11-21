const express = require("express");
const articlesController = require("./articles.controller");
const authMiddleware = require("../../middlewares/authMiddleware"); // Importez le middleware d'authentification
const router = express.Router();

router.get("/", articlesController.getAll);
router.get("/:id", articlesController.getById);
router.post("/", articlesController.create);
router.put("/:id", articlesController.update);
router.delete("/:id", articlesController.delete);

module.exports = router;
