// filepath: /C:/Users/Flami/Desktop/a/condominio/routes/logout.js
const express = require('express');
const SessionSave = require('../models/SessionSave');

const router = express.Router();

router.post('/', async (req, res) => {
    const { userid } = req.body;

    if (!userid) {
        console.error('No se proporcionó userid');
        return res.status(400).json({ error: 'No se proporcionó userid' });
    }

    console.log('Recibido request de logout para userid:', userid);  // Debugging

    try {
        const result = await SessionSave.deleteOne({ userid });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'No se encontró la sesión para eliminar' });
        }

        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ error: 'Error al cerrar sesión' });
    }
});

module.exports = router;