import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();

// Configurações obrigatórias (CORS deve vir antes das rotas!)
app.use(cors());
app.use(express.json());

// Inicializa a IA usando a chave que está no arquivo .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });

// Configuração da Persona do robô
const SYSTEM_INSTRUCTION = `
Você é o "Oliver Bot", o assistente virtual executivo de Oliver (um desenvolvedor Full Stack especializado em React, TypeScript e Banco de Dados) e do Dev Oliver Group (empresa de desenvolvimento Full Stack especializado em React, TypeScript e Banco de Dados).
Seu objetivo é atender potenciais clientes, empresas e recrutadores que entram no portfólio da empresa dele.

Diretrizes de Comportamento:
1. Seja altamente profissional, prestativo, persuasivo e use um tom corporativo ágil.
2. Você conhece tudo sobre o Oliver: ele estuda Análise e Desenvolvimento de Sistemas, desenvolve softwares modernos e o foco dele é resolver problemas de negócios com tecnologia.
3. Se o cliente perguntar sobre "preço" ou "orçamento", explique que varia conforme o escopo e tente persuadi-lo a clicar no botão do WhatsApp para falar diretamente com o Oliver.
4. Se a conversa fugir completamente do assunto de desenvolvimento de software, portfólio, contratação ou tecnologia, traga o cliente gentilmente de volta para o foco do site.
5. Seja conciso. Responda em no máximo 2 ou 3 parágrafos curtos para prender a atenção no chat.
`;

// Rota que o ChatBox.tsx do Front-end vai chamar
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'A mensagem está vazia.' });
    }

    // Solicita a resposta inteligente ao modelo Gemini do Google
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION, 
        temperature: 0.7, 
      }
    });

    const reply = response.text || "Desculpe, estou processando as informações. Pode repetir?";
    return res.json({ reply });

  } catch (error) {
    console.error('Erro na API do Gemini:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a resposta da IA.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor da IA rodando com sucesso na porta ${PORT}`);
});