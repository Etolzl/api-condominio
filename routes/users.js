const express = require('express');
const User = require('../models/user');
const Backup = require('../models/backup'); // Importar el modelo de respaldo
const crypto = require('crypto');
const router = express.Router();
// Obtener todos los usuarios
// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
    try {
        const { _iduser, telefono, nombre, apellido, contraseña, perfil, torre, departamento } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar solo los campos proporcionados
        if (_iduser) user._iduser = _iduser;
        if (telefono) user.telefono = telefono;
        if (nombre) user.nombre = nombre;
        if (apellido) user.apellido = apellido;
        if (contraseña) user.contraseña = contraseña; // Esto activará el hash en el esquema
        if (perfil) user.perfil = perfil;
        if (torre) user.torre = torre;
        if (departamento) user.departamento = departamento;

        await user.save();
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (err) {
        res.status(400).json({ error: 'Error al actualizar usuario' });
    }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router;
