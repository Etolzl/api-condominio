// api/routes/multas.js
const express = require('express');
const Multa = require('../models/Multa');
const Notificacion = require('../models/Notificacion'); // Importar el modelo de notificaciones
const router = express.Router();
const cors = require('cors');


// Obtener todas las multas
router.get('/', async (req, res) => {
  try {
    const multas = await Multa.find();
    //console.log('Multas encontradas:', multas);
    res.json(multas);
  } catch (error) {
    console.error('Error al obtener multas:', error);
    res.status(500).json({ message: 'Error obteniendo multas' });
  }
});


// Crear nueva multa
// Crear nueva multa y notificación
router.post('/', async (req, res) => {
  const { departamento, motivo, monto, fecha, estadoDelPago, comentarios } = req.body;

  try {
    // Crear la multa
    const nuevaMulta = new Multa({
      departamento,
      motivo,
      monto,
      fecha,
      estadoDelPago,
      comentarios,
    });
    await nuevaMulta.save();

    // Crear la notificación
    const nuevaNotificacion = new Notificacion({
      idmulta: nuevaMulta._idmulta,
      departamento: nuevaMulta.departamento,
      mensaje: `Se ha registrado una nueva multa para el departamento ${nuevaMulta.departamento.nombreDepartamento} por el motivo: ${motivo}`,
    });
    await nuevaNotificacion.save();

    res.status(201).json({ multa: nuevaMulta, notificacion: nuevaNotificacion });
  } catch (error) {
    console.error('Error creando la multa o la notificación:', error);
    res.status(400).json({ message: 'Error creando la multa o la notificación', error });
  }
});

// Obtener todas las notificaciones por departamento
router.get('/notificaciones/:iddepa', async (req, res) => {
  const { iddepa } = req.params;

  try {
    const notificaciones = await Notificacion.find({ 'departamento._iddepa': iddepa });
    res.json(notificaciones);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ message: 'Error obteniendo notificaciones' });
  }
});

// Eliminar notificación por ID
router.delete('/notificaciones/:id', async (req, res) => {
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