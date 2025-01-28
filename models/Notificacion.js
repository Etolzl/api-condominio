const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  _idnotificacion: {
    type: String,
    required: true,
    unique: true,
    default: () => `N${Date.now()}`, // ID único basado en el timestamp
  },
  idmulta: {
    type: String,
    required: true,
  },
  departamento: {
    _iddepa: String,
    nombreDepartamento: String,
    torre: String,
  },
  mensaje: String,
  fecha: {
    type: Date,
    default: Date.now,
  },
  leido: {
    type: Boolean,
    default: false, // Indica si la notificación ha sido leída
  },
});

module.exports = mongoose.model('Notificacion', notificacionSchema);
