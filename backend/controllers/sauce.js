const Sauce = require("../models/sauce");
const fs = require('fs');

//Logique métier pour créer une nouvelle sauce

exports.createSauce = (req, res, next) => {
    
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;

    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersDisliked: [],
        usersLiked: [],
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { 
        res.status(400).json( { error })
    })
}

//Logique métier pour modifier une sauce

exports.modifySauce = (req, res, next) => {
    
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message : 'Unauthorized request'});
            } else {
                
                //Gestion de l'image lors de la modification d'une sauce
                if (req.file) {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    if (fs.existsSync(`images/${filename}`)) {
                        fs.unlinkSync(`images/${filename}`);
                    } 
                }
                  
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
                }
            })
        
        .catch ((error) => {
            res.status(400).json({ error });
        });
};


//Logique métier pour supprimer une sauce

exports.deleteSauce = (req, res, next) => {
Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({message: 'Unauthorized request'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

//Logique métier pour récupérer toutes les sauces

exports.getAllSauces = (req, res, next) => {
Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

//Logique métier pour récupérer une seule sauce

exports.getOneSauce = (req, res, next) => {
Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

//Logique métier pour la gestion des likes et dislikes

exports.likeSauce = (req, res, next) => {
    const sauceId = req.params.id;
    const userId = req.body.userId;
    const like = req.body.like;
    
    Sauce.findById(sauceId)
    .then((sauce) => {
        
        if (like === 0) {
        const likeIsInArray = (element) => element === userId;
        const indexLike = sauce.usersLiked.findIndex(likeIsInArray)
        const indexDislike = sauce.usersDisliked.findIndex(likeIsInArray)

            if (indexLike === -1) {
                sauce.usersDisliked.splice(indexDislike)
                sauce.dislikes = sauce.dislikes + 1
            }
            else {
                sauce.usersLiked.splice(indexLike)
                sauce.likes = sauce.likes - 1
            }
        }

        if (like === 1) {
            sauce.usersLiked.push(userId)
            sauce.likes = sauce.likes + 1
        }

        if (like === -1) {
            sauce.usersDisliked.push(userId)
            sauce.dislikes = sauce.dislikes + 1
        }

        sauce.save()
        .then((sauce) => res.status(200).json({ message: "Sauce likée" }))
        .catch((error) => res.status(500).json({ error }));
    })

    .catch((error) => {
        res.status(400).json({ error });
    });
}


