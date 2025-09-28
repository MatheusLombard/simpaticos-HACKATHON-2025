class Tabelas {
    init(conexao) {
        this.conexao = conexao;
        this.criarUsuarios();
        this.criarAgendamentos();
        this.criarMedicos();

    }

    criarUsuarios() {
        const sql = `
        CREATE TABLE IF NOT EXISTS USUARIOS
        ( 
            USUARIO_ID INT PRIMARY KEY AUTO_INCREMENT,  
            NOME VARCHAR(40),
            EMAIL VARCHAR(50),  
            SENHA VARCHAR(20),  
            DATANASCIMENTO DATE NOT NULL,  
            LOGRADOURO VARCHAR(30),  
            BAIRRO VARCHAR(25),  
            UF VARCHAR(2),  
            NUMEROCASA INT,  
            TELEFONE VARCHAR(14), 
            CPF VARCHAR(14),  
            CEP VARCHAR(14),
            Cidade VARCHAR(20)      
        )`;
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(`ERRO: ${erro}`);
            } else {
                console.log('Tabela USUARIO criada com sucesso');
            }
        })
    }

    criarAgendamentos() {
        const sql = `CREATE TABLE IF NOT EXISTS AGENDAMENTO 
                    ( 
                        AGENDAMENTO_ID INT PRIMARY KEY AUTO_INCREMENT,  
                        USUARIO_ID INT,  
                        MEDICOS_ID INT,  
                        DATACONSULTA DATE
                    );`
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(`ERRO: ${erro}`);
            } else {
                console.log('Tabela AGENDAMENTO criada com sucesso');
            }
        })
    }

    criarMedicos() {
        const sql = `CREATE TABLE IF NOT EXISTS MEDICOS 
                    ( 
                        MEDICO_ID INT PRIMARY KEY AUTO_INCREMENT,  
                        NOME VARCHAR(50) NOT NULL,  
                        ESPECIALIDADE VARCHAR(50) NOT NULL,  
                        CIDADE VARCHAR(50) NOT NULL
                    );`
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(`ERRO: ${erro}`);
            } else {
                console.log('Tabela MEDICOS criada com sucesso');
            }
        })
    }
    criarReferencia(){
        const sql = `ALTER TABLE AGENDAMENTO ADD FOREIGN KEY(USUARIO_ID) REFERENCES USUARIO (USUARIO_ID);
                    ALTER TABLE AGENDAMENTO ADD FOREIGN KEY(MEDICOS_ID) REFERENCES MEDICOS (MEDICOS_ID);`
    }
}
module.exports = new Tabelas; 
