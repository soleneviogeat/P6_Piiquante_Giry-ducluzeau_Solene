const user = require("../models/user");

//Logique métier pour créer un nouvel utilisateur

exports.createUser = (req, res, next) => {
    delete req.body._id;
    const user = new user ({
        email: req.body.email,
        password: req.body.password
    });
    user.save()
    .then(() => res.status(201).json({message: "Utilisateur enregistré"}))
    .catch(error => res.status(400).json({ error }));
}

//Logique métier pour modifier un utilisateur

exports.modifyUser = (req, res, next) => {
const user = new user({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
});
user.updateOne({_id: req.params.id}, user).then(
    () => {
    res.status(201).json({
        message: 'User updated successfully!'
    });
    }
).catch(
    (error) => {
    res.status(400).json({
        error: error
    });
    }
);
}

//Logique métier pour supprimer un utilisateur

exports.deleteUser = (req, res, next) => {
user.deleteOne({_id: req.params.id}).then(
    () => {
    res.status(200).json({
        message: 'Deleted!'
    });
    }
).catch(
    (error) => {
    res.status(400).json({
        error: error
    });
    }
);
}

//Logique métier pour récupérer un utilisateur

exports.getOneUser = (req, res, next) => {
user.findOne({ _id: req.params.id })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
}

//Logique métier pour récupérer tous les utilisateurs

exports.getAllUsers = (req, res, next) => {
user.find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(400).json({ error }));

}