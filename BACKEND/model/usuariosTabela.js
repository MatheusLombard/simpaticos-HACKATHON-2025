class Tabelas {
    init(conexao) {
        this.conexao = conexao;
        this.criarUsuarios();
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
}
module.exports = new Tabelas; 
