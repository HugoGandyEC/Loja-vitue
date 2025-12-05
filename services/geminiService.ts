import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Helper to check if API key exists
export const hasApiKey = (): boolean => !!process.env.API_KEY;

export const getProductAdvice = async (product: Product, question: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Desculpe, a chave de API não foi configurada. Não posso consultar o especialista no momento.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct a rich context for the model
    const context = `
      Você é um especialista de vendas da loja EcoSistens, expert em tecnologia e eletrônicos.
      Você está ajudando um cliente com dúvidas sobre o seguinte produto:
      
      Nome: ${product.name}
      Preço: R$ ${product.price.toFixed(2)}
      Descrição: ${product.description}
      Características: ${product.features.join(', ')}
      
      Pergunta do cliente: "${question}"
      
      Responda de forma curta, útil, persuasiva e amigável (máximo 3 frases). Fale em Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });

    return response.text || "Desculpe, não consegui analisar sua pergunta agora.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocorreu um erro ao conectar com nosso assistente virtual. Tente novamente mais tarde.";
  }
};