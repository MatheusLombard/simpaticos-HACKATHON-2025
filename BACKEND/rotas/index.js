const rotaUsuarios = require('./usuarioRotas')
const chatBot = require('./chatbotRotas')
const autorizacao = require('./autorizacaoRotas')

module.exports = (app) =>{ 
    app.use(rotaUsuarios)
    app.use(chatBot)
    app.use(autorizacao)
}