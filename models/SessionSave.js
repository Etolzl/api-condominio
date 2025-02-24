const mongoose = require('mongoose');

const sessionSaveSchema = new mongoose.Schema({
    userid: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    tipo: { type: String, enum: ['persistente', 'temporal'], required: true }, // Distinción de tipo de sesión
    createdAt: { type: Date, default: Date.now },
    invalidado: { type: Boolean, default: false },
});

// Expiración dinámica según el tipo
sessionSaveSchema.index({ createdAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { tipo: 'temporal' }, expireAfterSeconds: 86400 }); // 1 dia para 'temporal'
sessionSaveSchema.index({ createdAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { tipo: 'persistente' }, expireAfterSeconds: 604800 }); // 7 días para 'persistente'

module.exports = mongoose.model('SessionSave', sessionSaveSchema);
