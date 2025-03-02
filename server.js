const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const verifyToken = require('./middleware/verifyToken'); // Middleware de autenticación

const app = express();
const PORT = process.env.PORT || 4001;

const registro = require('./routes/registro');
const login = require('./routes/login');
const multas = require('./routes/multas');
const departamentos = require('./routes/departamentos');
const users = require('./routes/users');
const logoutRoute = require('./routes/logout'); // Asegúrate de importar la ruta correctamente
const verifyTokenRoute = require('./routes/verifyTokenRoute'); // Importar la nueva ruta
const changePasswordRoute = require('./routes/changePassword');

console.log("Mongo URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) => console.error('Error conectando a MongoDB:', error));

app.use(cors());
app.use(express.json());

const recoverPasswordRoute = require('./routes/recoverPassword');
app.use('/api', recoverPasswordRoute);


// Rutas públicas (no requieren autenticación)
app.use('/api/login', login);
app.use('/registro', registro);
app.use('/api/logout', logoutRoute); // <- Asegúrate de que esté incluida
app.use('/api/verify-token', verifyTokenRoute); // Usar la nueva ruta
app.use('/api/cambiar-contra', changePasswordRoute);

// Rutas protegidas (requieren token)
app.use('/api/multas', verifyToken, multas);
app.use('/api/departamentos', verifyToken, departamentos);
app.use('/api/users', verifyToken, users);

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));