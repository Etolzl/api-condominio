const express = require('express');
const User = require('../models/user');
const verifyToken = require('../middleware/verifyToken'); // Middleware de autenticación
const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { telefono, nombre, apellido, contraseña, perfil, torre, departamento } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (telefono) user.telefono = telefono;
    if (nombre) user.nombre = nombre;
    if (apellido) user.apellido = apellido;
    if (contraseña) user.contraseña = contraseña;
    if (perfil) user.perfil = perfil;
    if (torre) user.torre = torre;
    if (departamento) user.departamento = departamento;

    await user.save();
    res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
