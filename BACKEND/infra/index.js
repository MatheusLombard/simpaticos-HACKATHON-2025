const mysql = require('mysql');

let conexao = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    database: 'hackathon'
});

conexao.connect(function (error) {
    if (error) {
        throw console.log("Erro na conexão, mensagem: " + error)
    }
    return console.log("Conectado ao banco de dados")

})


module.exports = conexao;
