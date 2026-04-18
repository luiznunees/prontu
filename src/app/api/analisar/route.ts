import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { texto } = await req.json();

    if (!texto) {
      return NextResponse.json({ error: "Texto não fornecido" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.2, // Baixa temperatura para avaliação analítica
        responseMimeType: "application/json",
      },
    });

    const prompt = `Você é um analisador de texto especializado em detectar características de escrita humana vs IA.
Analise o texto abaixo e retorne APENAS um JSON válido com esta estrutura exata:
{
  "scoreHumano": 72,
  "scoreIA": 28,
  "nivel": "moderado",
  "pontos_fortes": [
    "Uso variado de conectivos",
    "Frases com ritmo natural"
  ],
  "pontos_fracos": [
    "Estrutura muito formal em alguns trechos",
    "Repetição de padrões de frase"
  ],
  "sugestao": "O texto tem boa base. Para parecer mais humano, varie mais o tamanho das frases."
}

Regras para o score:
- scoreHumano + scoreIA = 100
- nivel pode ser: "baixo" (0-40% humano), "moderado" (41-70%), "alto" (71-100%)
- pontos_fortes: 2-3 itens positivos
- pontos_fracos: 2-3 itens a melhorar
- sugestao: 1 frase de conselho prático

Texto para analisar:
${texto}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedResponse = responseText.replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedResponse));

  } catch (error: any) {
    console.error("Erro na API de analisar:", error);
    return NextResponse.json(
      { error: "Erro ao analisar o texto." },
      { status: 500 }
    );
  }
}
