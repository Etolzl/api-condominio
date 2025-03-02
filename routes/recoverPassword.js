const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SessionSave = require('../models/SessionSave');
const fetch = require('node-fetch'); // Importar node-fetch para hacer solicitudes HTTP

const router = express.Router();

router.post('/solicitar-restablecimiento', async (req, res) => {
    const { lada, telefono } = req.body;

    if (!lada || !telefono) {
        return res.status(400).json({ error: 'LADA y teléfono son requeridos' });
    }

    try {
        const telefonoCompleto = `${lada}${telefono}`;
        const usuario = await User.findOne({ telefono: telefonoCompleto });

        if (!usuario) {
            return res.status(404).json({ error: 'El número de teléfono no está registrado' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { iduser: usuario._iduser, telefono: usuario.telefono, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        // Guardar el token en la base de datos
        await SessionSave.create({
            userid: usuario._id,
            token,
            tipo: 'temporal',
            createdAt: new Date()
        });

        // Configuración del mensaje para Meta Business Suite
        const mensaje = {
            messaging_product: "whatsapp",
            to: telefonoCompleto, // Número de teléfono completo con LADA
            type: "template",
            template: {
                name: "cambios_acc", // Nombre de la plantilla en Meta
                language: { code: "en_US" }, // Cambia el idioma si es necesario
                components: [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: usuario.nombre }, // Nombre del usuario
                            { type: "text", text: telefonoCompleto } // Número del usuario en el mensaje
                        ]
                    },
                    {
                        type: "button",
                        sub_type: "url",
                        index: 0,
                        parameters: [
                            { type: "text", text: token } // 🔹 Solo el JWT sin la URL
                        ]
                    }
                ]
            }
        };

        // Enviar solicitud a la API de Meta Business Suite
        const response = await fetch('https://graph.facebook.com/v22.0/543206735549320/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mensaje)
        });

        const result = await response.json();
        if (!response.ok) {
            console.error('Detalles del error de Meta Business Suite:', result);
            return res.status(500).json({ error: 'Error enviando mensaje', details: result });
        }

        return res.status(200).json({ mensaje: 'Mensaje enviado correctamente' });
    } catch (error) {
        console.error('Error en solicitud de recuperación:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.get('/verificar-token/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Verificar si el token existe en la base de datos
        const session = await SessionSave.findOne({ token });

        if (!session) {
            return res.status(404).json({ error: 'Token inválido o expirado.' });
        }

        // Verificar si el token ha expirado
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            await SessionSave.deleteOne({ token }); // Eliminar el token expirado
            return res.status(401).json({ error: 'Token expirado.' });
        }
        res.status(401).json({ error: 'Token inválido.' });
    }
});

module.exports = router;