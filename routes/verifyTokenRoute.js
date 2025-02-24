const express = require('express');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token válido' });
});

module.exports = router;