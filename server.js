const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 4001;

const registro = require('./routes/registro');
const login = require('./routes/login');
const multas = require('./routes/multas');
const departamentos = require('./routes/departamentos');

console.log("Mongo URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) => console.error('Error conectando a MongoDB:', error));

app.use(cors());
app.use(express.json());

app.use('/registro', registro);
app.use('/api/login', login);
app.use('/api/multas', multas);
app.use('/api/departamentos', departamentos);



// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
