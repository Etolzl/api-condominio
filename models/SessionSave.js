const mongoose = require('mongoose');

const sessionSaveSchema = new mongoose.Schema({
    userid: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    tipo: { type: String, enum: ['persistente', 'temporal'], required: true }, // Distinción de tipo de sesión
    createdAt: { type: Date, default: Date.now },
    invalidado: { type: Boolean, default: false },
});

// Expiración dinámica según el tipo
sessionSaveSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 600, // 10 minutos para 'temporal'
        partialFilterExpression: { tipo: 'temporal' }
    }
);

sessionSaveSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 604800, // 7 días para 'persistente'
        partialFilterExpression: { tipo: 'persistente' }
    }
);

module.exports = mongoose.model('SessionSave', sessionSaveSchema);
