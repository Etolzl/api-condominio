const express = require('express');
const User = require('../models/user');
const Departamento = require('../models/Departamento'); // Asume que tienes un modelo para esta colección
const router = express.Router();

router.post('/', async (req, res) => {
  const { telefono, contraseña } = req.body;

  try {
    // Busca al usuario por el teléfono
    const user = await User.findOne({ telefono });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verifica la contraseña
    if (user.contraseña !== contraseña) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Busca el departamento vinculado al usuario
    const departamento = await Departamento.findOne({ _iddepa: user._iddepa });
    if (!departamento) {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }

    // Responde con los datos del usuario y departamento
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        iduser: user._iduser,
        telefono: user.telefono,
        perfil: user.perfil,
        nombre: user.nombre,
        iddepa: user._iddepa,
        nombreDepartamento: departamento.nombreDepartamento, // Retorna el nombre del departamento
      },
    });

    // Imprime el ID del departamento en la consola
    console.log('ID del departamento:', user._iddepa);
    console.log('Nombre del departamento:', departamento.nombreDepartamento);
  } catch (err) {
    console.error('Error en /login:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
