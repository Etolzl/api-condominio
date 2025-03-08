const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Asegúrate de que el modelo User está en esta ruta
require('dotenv').config();

const verifyRol = (rolesPermitidos) => {
    return async (req, res, next) => {
        try {
            const token = req.header('Authorization').replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _iduser: decoded._iduser });
            
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            if (!rolesPermitidos.includes(user.perfil)) {
                return res.status(403).json({ error: 'Acceso denegado. No tienes los permisos necesarios.' });
            }

            req.user = user; // Pasamos el usuario al siguiente middleware
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Token inválido o expirado.' });
        }
    };
};

module.exports = verifyRol;
