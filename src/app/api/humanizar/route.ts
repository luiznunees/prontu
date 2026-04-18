import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const promptPorNivel = {
  leve: `Você é um assistente de reescrita para estudantes brasileiros do ensino médio.
Reescreva o texto abaixo de forma LEVEMENTE mais natural e humana.
Mantenha 90% do conteúdo original. Apenas:
- Varie algumas estruturas de frase
- Adicione conectivos naturais ("além disso", "vale ressaltar", "por outro lado")
- Substitua 2-3 palavras muito formais por equivalentes mais naturais
Mantenha formatação de parágrafos. Retorne APENAS o texto reescrito, sem explicações.`,

  medio: `Você é um assistente de reescrita para estudantes brasileiros do ensino médio.
Reescreva o texto abaixo de forma MODERADAMENTE mais humana e pessoal.
- Adicione opiniões sutis ("É notável que...", "Percebe-se que...")
- Varie o ritmo das frases (algumas curtas, outras longas)
- Use exemplos concretos quando possível
- Adicione transições mais naturais entre parágrafos
- Mantenha o conteúdo técnico mas com linguagem mais fluida
Mantenha formatação. Retorne APENAS o texto reescrito.`,

  forte: `Você é um estudante brasileiro do ensino médio reescrevendo um trabalho escolar.
Reescreva o texto abaixo de forma BASTANTE natural, como se um aluno inteligente tivesse escrito:
- Use voz ativa sempre que possível
- Adicione perspectiva pessoal ocasional ("Na minha visão...", "É interessante notar que...")
- Varie bastante a estrutura das frases
- Use vocabulário rico mas acessível para um estudante de ensino médio
- Adicione exemplos do cotidiano quando relevante
- Mantenha toda a informação factual correta
Retorne APENAS o texto reescrito, sem comentários.`
};

export async function POST(req: NextRequest) {
  try {
    const { texto, nivel } = await req.json();

    if (!texto || !nivel || !(nivel in promptPorNivel)) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.8, // Mais criativo
        maxOutputTokens: 4096,
      },
    });

    const promptSystem = promptPorNivel[nivel as keyof typeof promptPorNivel];
    const promptFinal = `${promptSystem}\n\nTexto original:\n${texto}`;

    const result = await model.generateContent(promptFinal);
    const textoHumanizado = result.response.text().trim();

    return NextResponse.json({
      textoHumanizado,
      caracteresOriginais: texto.length,
      caracteresNovos: textoHumanizado.length
    });

  } catch (error: any) {
    console.error("Erro na API de humanizar:", error);
    return NextResponse.json(
      { error: "Erro ao humanizar o texto." },
      { status: 500 }
    );
  }
}
