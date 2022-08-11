const passwordSchema = require("../models/password");

// Contrôle du format du mot de passe
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.writeHead(400,"Le mot de passe doit comprendre 8 caractères dont un chiffre, une majuscule, une miniscule sans espaces",
      {
        "content-type": "application/json",
      }
    )
    res.end("Le format du mot de passe est incorrect.");
  } else {
    next();
  }
};