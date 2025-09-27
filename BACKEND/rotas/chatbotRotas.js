// Importa o framework Express
const {Router} = require('express');

// Cria um objeto router (módulo de rotas do Express)
const router = Router();

// Importa a função que faz a chamada para o Hugging Face (serviço externo de IA)
const { askHuggingFace } = require('../scripts/scriptsChat');

/**
 * Rota POST /
 * Endpoint: /api/chat
 * Objetivo: Receber uma pergunta do frontend e retornar a resposta da IA (Hugging Face)
 */
router.post('/question', async (req, res) => {
  // Extrai a pergunta enviada no corpo da requisição (JSON)
  const { question } = req.body;
  if(!question){
    res.send('Preencha todas as informações')
  }

  try {
    // Chama a função que consulta a API da Hugging Face e espera a resposta
    const answer = await askHuggingFace(question);

    // Retorna a resposta em formato JSON para o frontend
    res.status(200).json({ response: answer });
  } catch (error) {
    // Se ocorrer erro na chamada, mostra no console e responde com status 500
    console.error("Erro ao chamar Hugging Face:", error);
    res.status(500).json({ error: 'Erro ao se comunicar com a IA' });
  }
});

// Exporta o router para ser usado no server.js
module.exports = router;