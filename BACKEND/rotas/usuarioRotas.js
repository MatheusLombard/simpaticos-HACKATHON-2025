const {Router} = require('express')
const scriptsUsuario = require('../scripts/scriptsUsuario')
const router = Router()

router.get('/', (req, res) => {
    res.send('Link para a api dos SIMPATICOS DA FACEF, feito por Matheus!')
})


router.post('/login', (req, res) => {
    if(!req.body.email || !req.body.senha){
        res.send('Envie todos os dados')
    }else{
        const usuarios = {
            email: req.body.email,
            senha: req.body.senha
        }
        const resLogin = scriptsUsuario.scriptLogin(usuarios)
        resLogin
            .then((value) => res.status(200).json(value))
            .catch((error) => res.status(500).json(error))
        }
    })


router.post('/cadastro', (req, res) => {
    const {nome, email, senha, datanascimento, logradouro, bairro, uf, numerocasa, telefone, cpf, cep, cidade} = req.body
    if(!nome || !email || !senha || !datanascimento || !logradouro || !bairro || !uf || !numerocasa || !telefone || !cpf || !cep || !cidade){
        res.send('Envie todos os dados')
    }else{
        const usuario = {
            nome: nome,
            email: email,
            senha: senha,
            datanascimento: datanascimento,
            logradouro: logradouro,
            bairro: bairro,
            uf: uf,
            numerocasa: numerocasa,
            telefone: telefone,
            cpf: cpf,
            cep: cep,
            cidade: cidade
        }
        const resCadastro = scriptsUsuario.scriptCadastro(usuario)
        resCadastro
            .then((value) => res.status(200).json(value))
            .catch((error) => res.status(500).json(error))
    }
})



module.exports = router