// api/models/Multa.js
const mongoose = require('mongoose');

const multaSchema = new mongoose.Schema({
  _idmulta: {
    type: String,
    required: true,
    unique: true,
    default: () => `M${Date.now()}`, // Generar automáticamente un ID de multa único basado en el timestamp
  },
  departamento: {
    _iddepa: String,
    nombreDepartamento: String,
    torre: String, // Agregar torre al departamento
  },
  motivo: String,
  monto: Number,
  fecha: Date,
  estadoDelPago: String,
  comentarios: String,
});

const Multa = mongoose.model('Multas', multaSchema);

module.exports = Multa;
