const {Router} = require('express');
const scriptAutorizacao = require('../scripts/scriptAutorizacao');
const router = Router();

router.post('/autorizacao', (req, res) => { 
    const {terminologia} = req.body;

    const resAutorizacao = scriptAutorizacao.verficar(terminologia)
    resAutorizacao
        .then((value) => res.status(200).json(value))
        .catch((error) => res.status(500).json(error))

})

module.exports = router