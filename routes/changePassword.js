const express = require('express');
const router = express.Router();
const User = require('../models/user');
const SessionSave = require('../models/SessionSave');
const jwt = require('jsonwebtoken'); // Importa jwt para decodificar el token

router.post('/', async (req, res) => {
    const { token, nuevaContra } = req.body;

    try {
        // Decodificar el token para obtener el iduser
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const iduser = decodedToken.iduser;

        // Buscar al usuario por _iduser
        const user = await User.findOne({ _iduser: iduser });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Cambiar la contraseña
        user.contraseña = nuevaContra;
        await user.save();

        // Invalidar todos los tokens guardados en la base de datos
        await SessionSave.updateMany({ userid: user._iduser }, { invalidado: true });

        // Responder con éxito
        res.status(200).json({ mensaje: 'Contraseña actualizada correctamente', eliminarToken: true });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;