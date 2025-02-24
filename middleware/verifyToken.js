const jwt = require('jsonwebtoken');
const SessionSave = require('../models/SessionSave');

const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'Acceso denegado. Token no proporcionado.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;

        // Buscar token en la BD con su tipo
        const session = await SessionSave.findOne({ userid: verified.iduser, token });

        if (!session) {
            return res.status(401).json({ error: 'Token inválido o expirado.', invalidado: true });
        }

        if (session.invalidado) {
            return res.status(401).json({ error: 'El token ha sido invalidado. Inicie sesión nuevamente.', invalidado: true });
        }

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            await SessionSave.deleteOne({ token });
            return res.status(401).json({ error: 'Token expirado. Inicie sesión nuevamente.', expired: true });
        }
        res.status(401).json({ error: 'Token inválido. Acceso denegado.', invalidado: true });
    }
};

module.exports = verifyToken;
