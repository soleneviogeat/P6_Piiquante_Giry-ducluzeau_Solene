const Sauce = require("../models/sauce");
const fs = require('fs');

//Logique métier pour créer un nouvel utilisateur

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(sauceObject)
    delete sauceObject._id;
    delete sauceObject.userId;

    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  console.log(sauce)
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { 
        console.log(error)
        res.status(400).json( { error })
    })
}

