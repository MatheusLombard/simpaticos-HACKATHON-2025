const conexao = require('../infra/index')

class Autorizacao {
    verficar(terminologia) {
        const sql = `SELECT ROL___PROCEDIMENTOS.Auditoria from ROL___PROCEDIMENTOS WHERE ROL___PROCEDIMENTOS.Terminologia like '${terminologia}'`

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

module.exports = new Autorizacao