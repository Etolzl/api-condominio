// api/routes/departamentos.js
const express = require('express');
const Departamento = require('../models/Departamento');
const router = express.Router();

// Obtener todos los departamentos
router.get('/', async (req, res) => {
  try {
    const departamentos = await Departamento.find();
    res.json(departamentos);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo departamentos' });
  }
});

module.exports = router;
