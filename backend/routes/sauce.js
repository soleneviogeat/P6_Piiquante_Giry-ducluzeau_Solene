const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config")
//const Sauce = require('../models/sauce');


const sauceController = require("../controllers/sauce");

//REQUÊTE POST


  
  //REQUÊTE GET

router.get("/", auth, sauceController.getAllSauces);
router.post("/", auth, multer, sauceController.createSauce)
router.get('/:id',auth, sauceController.getOneSauce);
router.put('/:id', auth, multer, sauceController.modifySauce);
router.delete('/:id', auth, sauceController.deleteSauce);


module.exports = router;