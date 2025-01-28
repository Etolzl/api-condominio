const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  tipoCambio: { type: String, required: true },  // 'agregado', 'modificado', 'eliminado'
  usuario: { type: String, required: true },    // Nombre del usuario
  source: { type: String, required: true },     // 'app' o 'manual' (fuera de la app)
  timestamp: { type: Date, default: Date.now }, // Fecha y hora del cambio
});

module.exports = mongoose.model('Log', logSchema);
