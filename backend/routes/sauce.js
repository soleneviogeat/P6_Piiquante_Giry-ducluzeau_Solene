const express = require('express');
const router = express.Router();
const auth = require("../middleware/jsonwebtoken-config");
const multer = require("../middleware/multer-config")
const sauceController = require("../controllers/sauce");

//Routes pour les évènements liés à la gestion des sauces

router.get("/", auth, sauceController.getAllSauces);
router.post("/", auth, multer, sauceController.createSauce)
router.get('/:id',auth, sauceController.getOneSauce);
router.put('/:id', auth, multer, sauceController.modifySauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.post("/:id/like", auth, sauceController.likeSauce);


module.exports = router;