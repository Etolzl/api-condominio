const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _iduser: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  contraseña: { type: String, required: true },
  perfil: { type: String, required: true },
  torre: { type: String, required: true },
  departamento: { type: String, required: true },
  _iddepa: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);