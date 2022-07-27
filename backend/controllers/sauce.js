const Sauce = require("../models/sauce");
const fs = require('fs');
const sauce = require("../models/sauce");

//Logique métier pour créer une nouvelle sauce

exports.createSauce = (req, res, next) => {
    console.log('icii', req.body);
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(sauceObject)
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
  console.log(sauce)
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { 
        console.log(error)
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
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//Logique métier pour supprimer une sauce

exports.deleteSauce = (req, res, next) => {
Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
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

// User is liking / disliking a sauce
exports.likeSauce = (req, res, next) => {
    const sauceId = req.params.id;
    const userId = req.body.userId;
    const like = req.body.like;
    
    Sauce.findById(sauceId)
    .then((sauce) => {
        
        if (like === 0) {
        const isInArray = (element) => element === userId;
        const indexLike = sauce.usersLiked.findIndex(isInArray)
        const indexDislike = sauce.usersDisliked.findIndex(isInArray)
        console.log('indexLike', indexLike);

            if (indexLike === -1) {
                console.log('Je viens denlever un dislike', userId)
                sauce.usersDisliked.splice(indexDislike)
                sauce.dislikes = sauce.dislikes + 1
            }
            else {
                console.log('Je viens denlever un like', userId)
                sauce.usersLiked.splice(indexLike)
                sauce.likes = sauce.likes - 1
            }
        }

        if (like === 1) {
            console.log('Je viens dajouter un like', userId)
            sauce.usersLiked.push(userId)
            sauce.likes = sauce.likes + 1
        }

        if (like === -1) {
            console.log('Je viens dajouter un dislike', userId)
            sauce.usersDisliked.push(userId)
            sauce.dislikes = sauce.dislikes + 1
        }
        console.log('tableau des likeurs', sauce.usersLiked)
        console.log('tableau des dislikeurs', sauce.usersDisliked)

        sauce.save()
        .then((sauce) => res.status(200).json({ message: "Sauce likée" }))
        .catch((error) => res.status(500).json({ error }));
    })

    .catch((error) => {
        res.status(400).json({ error });
    });
}

