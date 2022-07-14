const express = require('express');
const user = require('../models/user');
const router = express.Router();

const stuffController = require("../controllers/stuff");

//REQUÊTE POST

router.post("/", stuffController.createUser);
  
  //REQUÊTE GET
  
router.get('/:id', stuffController.getOneUser);
router.put('/:id', stuffController.modifyUser);
router.delete('/:id', stuffController.deleteUser);
router.get("/", stuffController.getAllUsers);

module.exports = router;