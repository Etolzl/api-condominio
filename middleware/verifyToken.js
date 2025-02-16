const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extraer token del encabezado
    
    if (!token) {
        return res.status(403).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Guardar usuario autenticado en req
        next(); // Continuar con la siguiente función
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado. Inicie sesión nuevamente.' });
        }
        res.status(401).json({ error: 'Token inválido. Acceso denegado.' });
    }
};

module.exports = verifyToken;
