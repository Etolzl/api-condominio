const express = require('express'); 
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Para generar claves aleatorias
const User = require('../models/user');
const Departamento = require('../models/Departamento');

const router = express.Router();

router.post('/', async (req, res) => {
  const { telefono, contraseña } = req.body;

  try {
    // Verificar si JWT_SECRET está vacío y generarlo automáticamente
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
      process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex'); 
      //console.log("Nuevo JWT_SECRET generado:", process.env.JWT_SECRET);
    }

    // Buscar usuario por teléfono
    const user = await User.findOne({ telefono });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña (sin hash, comparación directa)
    if (user.contraseña !== contraseña) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Buscar departamento asociado
    const departamento = await Departamento.findOne({ _iddepa: user._iddepa });
    if (!departamento) {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }

    // Generar token único con tiempo de expiración de 2 horas
    const token = jwt.sign(
      { id: user._id, perfil: user.perfil, iddepa: user._iddepa },  // Ahora incluye `iddepa`
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        iduser: user._id,
        telefono: user.telefono,
        perfil: user.perfil,
        nombre: user.nombre,
        iddepa: user._iddepa,
        nombreDepartamento: departamento.nombreDepartamento,
      },
    });
  } catch (err) {
    console.error('Error en /login:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
