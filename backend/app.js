const express = require('express');
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const path = require('path');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Swizz26:McDGvh6y.f_XMzG@p6-piiquante.jl2wy3r.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();

});


app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;