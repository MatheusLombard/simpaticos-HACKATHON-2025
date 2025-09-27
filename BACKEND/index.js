const con = require('./infra/index.js');
const tabelas = require('./model/usuariosTabela.js')

tabelas.init(con)

//rotas ----
const express = require('express')
const cors = require('cors');
require('dotenv').config()

const app = express()
const porta = process.env.PORTA

app.use(express.json());
app.use(cors())

const router = require('./rotas/index.js')
router(app)


app.listen(porta, () =>{
    console.log(`Rodando na porta ${porta}`)
})