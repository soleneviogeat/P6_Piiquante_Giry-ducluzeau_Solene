const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Swizz26:McDGvh6y.f_XMzG@p6-piiquante.jl2wy3r.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));