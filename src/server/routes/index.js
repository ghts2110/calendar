const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Servidor está funcionando!');
});

module.exports = router;
