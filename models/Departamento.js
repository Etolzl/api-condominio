// models/Departamento.js
const mongoose = require('mongoose');

const departamentoSchema = new mongoose.Schema({
  _iddepa: { type: String, required: true, unique: true },
  nombreDepartamento: { type: String, required: true },
  usuario: { type: Object, required: true },
  torre: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Departamento', departamentoSchema);
