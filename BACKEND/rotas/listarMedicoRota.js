const {Router} = require('express')
const scriptsUsuario = require('../scripts/scriptsUsuario')
const router = Router()

router.post('/medicos', (req, res) => {
    const {usuario_id, especialidades} = req.body

    const resMedicos = scriptsUsuario.scriptMedicosCompativeis(usuario_id, especialidades)
    resMedicos
        .then((value) => res.status(200).json(value))
        .catch((error) => res.status(500).json(error))
    })




module.exports = router