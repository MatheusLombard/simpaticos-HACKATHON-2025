const conexao = require("../infra");

class Agendamento {
    horariosOcupados(medicoId, data) {
        const sql = `SELECT DATE_FORMAT(DATACONSULTA, '%Y-%m-%d %H:%i') as horario_agendado 
            FROM AGENDAMENTO 
            WHERE MEDICOS_ID = ? AND DATE(DATACONSULTA) = ?`;
        return new Promise((resolve, reject) => {
            conexao.query(sql, [medicoId, data], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
    agendar(usuarioId, medicoId, dataHora) {
        const sql = `INSERT INTO AGENDAMENTO (USUARIO_ID, MEDICOS_ID, DATACONSULTA) VALUES (?, ?, ?)`;
        return new Promise((resolve, reject) => {
            conexao.query(sql, [usuarioId, medicoId, dataHora], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = new Agendamento