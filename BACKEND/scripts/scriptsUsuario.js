const conexao = require('../infra/index')


class ScriptsUsuarios {
    scriptLogin(usuario){
        const sql = `SELECT USUARIOS.USUARIO_ID FROM USUARIOS WHERE USUARIOS.EMAIL = '${usuario.email}' AND USUARIOS.SENHA = '${usuario.senha}'`;

        return new Promise((resolve, reject) =>{
            conexao.query(sql, {}, (error, result) =>{
                if(error) reject(error) 
                console.log(result.length)
                if(result.length == 0 ){
                    resolve('Usuario não encontrado')
                }
                resolve(result)
            })

        })
    }
    scriptCadastro(usuario){
        const sql = `INSERT INTO USUARIOS (NOME, EMAIL, SENHA, DATANASCIMENTO, LOGRADOURO, BAIRRO, CIDADE,  UF, NUMEROCASA, TELEFONE, CPF, CEP) VALUES ('${usuario.nome}','${usuario.email}','${usuario.senha}','${usuario.datanascimento}','${usuario.logradouro}','${usuario.bairro}', '${usuario.cidade}','${usuario.uf}',${usuario.numerocasa},'${usuario.telefone}','${usuario.cpf}','${usuario.cep}')`;

        return new Promise((resolve, reject) => {
            conexao.query(sql, {}, (error, result) => {
                if(error){
                    reject(error)
                }
                resolve(result)
            })
        })
    }
}

module.exports = new ScriptsUsuarios