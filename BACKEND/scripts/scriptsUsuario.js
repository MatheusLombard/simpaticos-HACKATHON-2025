const conexao = require('../infra/index')


class ScriptsUsuarios {
    scriptLogin(usuario) {
        const sql = `SELECT USUARIOS.USUARIO_ID FROM USUARIOS WHERE USUARIOS.EMAIL = '${usuario.email}' AND USUARIOS.SENHA = '${usuario.senha}'`;

        return new Promise((resolve, reject) => {
            conexao.query(sql, {}, (error, result) => {
                if (error) reject(error)
                console.log(result.length)
                if (result.length == 0) {
                    resolve('Usuario não encontrado')
                }
                resolve(result)
            })

        })
    }
    scriptCadastro(usuario) {
        const sql = `INSERT INTO USUARIOS (NOME, EMAIL, SENHA, DATANASCIMENTO, LOGRADOURO, BAIRRO, CIDADE,  UF, NUMEROCASA, TELEFONE, CPF, CEP) VALUES ('${usuario.nome}','${usuario.email}','${usuario.senha}','${usuario.datanascimento}','${usuario.logradouro}','${usuario.bairro}', '${usuario.cidade}','${usuario.uf}',${usuario.numerocasa},'${usuario.telefone}','${usuario.cpf}','${usuario.cep}')`;

        return new Promise((resolve, reject) => {
            conexao.query(sql, {}, (error, result) => {
                if (error) {
                    reject(error)
                }
                resolve(result)
            })
        })
    }
    scriptMedicosCompativeis(usuario_id, especialidades) {
        // Busca cidade e especialidade do usuário
        const sqlPreferencia = `SELECT CIDADE FROM USUARIOS WHERE USUARIO_ID = ?`;
        return new Promise((resolve, reject) => {
            conexao.query(sqlPreferencia, [usuario_id], (error, results) => {
                if (error) return reject(error);
                if (results.length === 0) return resolve('Usuário não encontrado'); // Usuário não encontrado
                const cidade = results[0].CIDADE;
                const especialidade = especialidades;
                const sqlMedicos = `SELECT * FROM MEDICOS WHERE CIDADE = ? AND ESPECIALIDADE = ?`;
                conexao.query(sqlMedicos, [cidade, especialidade], (error, medicos) => {
                    if (error) return reject(error);
                    resolve(medicos);
                });
            });
        });
    }
}

module.exports = new ScriptsUsuarios();