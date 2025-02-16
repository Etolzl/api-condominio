const express = require('express');
const Multa = require('../models/Multa');
const Notificacion = require('../models/Notificacion');
const authMiddleware = require('../middleware/verifyToken'); // Importar el middleware
const router = express.Router();

// Obtener multas del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { perfil, iddepa } = req.user;
        //console.log("Perfil:", perfil);
        //console.log("ID Departamento en Token:", iddepa);

        let multas;
        if (perfil === 'Administrador') {
            multas = await Multa.find();
        } else {
            //console.log("Buscando multas con iddepa:", String(iddepa)); // Agregar esta línea
            multas = await Multa.find({ 'departamento._iddepa': String(iddepa) });
            //console.log("Multas encontradas:", multas); // Agregar esta línea
        }

        res.json(multas);
    } catch (error) {
        console.error('Error al obtener multas:', error);
        res.status(500).json({ message: 'Error obteniendo multas' });
    }
});



// Crear una multa (requiere autenticación)
router.post('/', authMiddleware, async (req, res) => {
    const { departamento, motivo, monto, fecha, estadoDelPago, comentarios } = req.body;

    try {
        const nuevaMulta = new Multa({
            departamento,
            motivo,
            monto,
            fecha,
            estadoDelPago,
            comentarios,
        });
        await nuevaMulta.save();

        const nuevaNotificacion = new Notificacion({
            idmulta: nuevaMulta._idmulta,
            departamento: nuevaMulta.departamento,
            mensaje: `Se ha registrado una nueva multa para el departamento ${nuevaMulta.departamento.nombreDepartamento} por el motivo: ${motivo}`,
        });
        await nuevaNotificacion.save();

        res.status(201).json({ multa: nuevaMulta, notificacion: nuevaNotificacion });
    } catch (error) {
        console.error('Error creando multa:', error);
        res.status(400).json({ message: 'Error creando multa o notificación' });
    }
});

// Obtener notificaciones de un departamento específico
router.get('/notificaciones/:iddepa', authMiddleware, async (req, res) => {
    const { iddepa } = req.params; // Obtener iddepa desde la URL
    //console.log("Obteniendo notificaciones para iddepa:", iddepa);

    try {
        const notificaciones = await Notificacion.find({ 'departamento._iddepa': iddepa });
        res.json(notificaciones);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: 'Error obteniendo notificaciones' });
    }
});

// Obtener notificaciones para el usuario autenticado
router.get('/notificaciones', authMiddleware, async (req, res) => {
    const iddepa = req.user.iddepa; // Obtener iddepa desde el token

    if (!iddepa) {
        return res.status(400).json({ message: 'ID de departamento no proporcionado' });
    }

    //console.log("Obteniendo notificaciones para iddepa:", iddepa);

    try {
        const notificaciones = await Notificacion.find({ 'departamento._iddepa': iddepa });
        res.json(notificaciones);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: 'Error obteniendo notificaciones' });
    }
});


// Eliminar notificación (requiere autenticación)
router.delete('/notificaciones/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const notificacionEliminada = await Notificacion.findByIdAndDelete(id);
        if (notificacionEliminada) {
            res.status(200).json({ message: 'Notificación eliminada correctamente' });
        } else {
            res.status(404).json({ message: 'Notificación no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar notificación:', error);
        res.status(500).json({ message: 'Error eliminando notificación' });
    }
});

module.exports = router;
