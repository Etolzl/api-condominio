const express = require('express'); 
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const SessionSave = require('../models/SessionSave'); // Importar modelo de sesión
const Departamento = require('../models/Departamento');

const router = express.Router();

router.post('/', async (req, res) => {
    const { telefono, contraseña, guardarSesion } = req.body;

    try {
        if (!process.env.JWT_SECRET) {
            process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
        }

        const user = await User.findOne({ telefono });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        if (user.contraseña !== contraseña) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const departamento = await Departamento.findOne({ _iddepa: user._iddepa });
        if (!departamento) return res.status(404).json({ error: 'Departamento no encontrado' });

        // Configurar el tiempo de expiración según si se guarda la sesión o no
        const expiresIn = guardarSesion ? '7d' : '1d'; // 7 días si se guarda, 1 dia si no
        const tokenTipo = guardarSesion ? 'persistente' : 'temporal';

        const token = jwt.sign(
            { iduser: user._iduser, perfil: user.perfil, iddepa: user._iddepa },
            process.env.JWT_SECRET,
            { expiresIn }
        );

        // Guardar en la base de datos con su tipo y expiración adecuada
        await SessionSave.findOneAndUpdate(
            { userid: user._iduser, tipo: tokenTipo }, 
            { userid: user._iduser, token, tipo: tokenTipo, createdAt: new Date() }, 
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
          message: 'Inicio de sesión exitoso',
          token,
          user: {
              iduser: user._iduser,
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
