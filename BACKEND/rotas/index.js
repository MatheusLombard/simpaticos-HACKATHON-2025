const rotaUsuarios = require('./usuarioRotas')
const chatBot = require('./chatbotRotas')
const autorizacao = require('./autorizacaoRotas')
const agendamentos = require('./agendamentoRotas')

module.exports = (app) =>{ 
    app.use(rotaUsuarios)
    app.use(chatBot)
    app.use(autorizacao)
    app.use(agendamentos)
}