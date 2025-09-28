
const express = require('express');
const scriptAutorizacao = require('../scripts/scriptAutorizacao');
const router = express.Router();

// Middleware para aceitar texto puro no body
router.use(express.text());


router.post('/autorizacao', async (req, res) => {
    try {
        // Recebe o texto puro do body
        const texto = req.body;
        // Divide o texto em array, separando por vírgula, ponto e vírgula ou quebra de linha
        const termos = texto.split(/[|;\n]/).map(t => t.trim()).filter(Boolean);
        // Consulta cada termo no banco
        const resultados = await Promise.all(
            termos.map(async termo => {
                try {
                    // Chama o scriptAutorizacao para cada termo
                    const resultado = await scriptAutorizacao.verficar(termo);
                    return { termo, resultado };
                } catch (error) {
                    return { termo, erro: error };
                }
            })
        );
        res.status(200).json(resultados);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router