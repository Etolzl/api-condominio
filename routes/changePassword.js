const express = require('express');
const router = express.Router();
const User = require('../models/user');
const SessionSave = require('../models/SessionSave'); // Importar modelo de sesiones guardadas

router.post('/', async (req, res) => {
    const { telefono, nuevaContraseña } = req.body;

    try {
        const user = await User.findOne({ telefono });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Cambiar la contraseña
        user.contraseña = nuevaContraseña;
        await user.save();

        // Invalidar todos los tokens guardados en la base de datos
        await SessionSave.updateMany({ userid: user._iduser }, { invalidado: true });

        // Responder con una indicación de que el token debe ser eliminado
        res.status(200).json({ mensaje: 'Contraseña actualizada correctamente', eliminarToken: true });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


module.exports = router;
