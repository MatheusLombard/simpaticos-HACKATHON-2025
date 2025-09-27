const rotaUsuarios = require('./usuarioRotas')
const chatBotUsuarios = require('./chatbotRotas')
module.exports = (app) =>{ 
    app.use(rotaUsuarios)
    app.use(chatBotUsuarios)
}