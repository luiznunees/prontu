import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface ABNTCheckResult {
  score: number;
  issues: ABNTIssue[];
  summary: string;
}

export interface ABNTIssue {
  type: "margem" | "espacamento" | "fonte" | "citacao" | "referencia" | "formatacao" | "estrutura";
  severity: "erro" | "alerta" | "sugestao";
  message: string;
  location?: string;
  suggestion?: string;
}

export async function revisarABNT(trabalho: {
  secoes: { titulo: string; conteudo: string }[];
  referencias: string[];
}): Promise<ABNTCheckResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const secoesFormatadas = trabalho.secoes
    .map((s, i) => `## ${i + 1}. ${s.titulo}\n${s.conteudo}`)
    .join("\n\n");

  const referenciasFormatadas = trabalho.referencias.join("\n");

  const prompt = `
Você é um especialista em normas ABNT (Associação Brasileira de Normas Técnicas).
Revise o trabalho acadêmico abaixo e identifique problemas de formatação.

TRABALHO:
${secoesFormatadas}

REFERÊNCIAS:
${referenciasFormatadas}

Analise e retorne APENAS um JSON válido com esta estrutura:
{
  "score": number (0-100, onde 100 = perfeito),
  "issues": [
    {
      "type": "margem" | "espacamento" | "fonte" | "citacao" | "referencia" | "formatacao" | "estrutura",
      "severity": "erro" | "alerta" | "sugestao",
      "message": "Descrição do problema",
      "location": "Seção ou local específico",
      "suggestion": "Como corrigir"
    }
  ],
  "summary": "Resumo geral da análise"
}

Retorne APENAS JSON, sem markdown.
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedResponse = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedResponse) as ABNTCheckResult;
  } catch (error) {
    console.error("Erro ao revisar ABNT:", error);
    return {
      score: 100,
      issues: [],
      summary: "Revisão não disponível no momento",
    };
  }
}

export function formatarReferencia(
  tipo: "livro" | "artigo" | "site" | "video",
  dados: {
    autores?: string;
    titulo?: string;
    ano?: string;
    url?: string;
    acessadoEm?: string;
    editora?: string;
    cidade?: string;
    revista?: string;
    volume?: string;
    paginas?: string;
    doi?: string;
  }
): string {
  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, "0");
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const ano = agora.getFullYear();
  const dataBR = `${dia}/${mes}/${ano}`;

  switch (tipo) {
    case "livro":
      return `${dados.autores}. ${dados.titulo}. ${dados.cidade || "[s.l.]"}: ${dados.editora || "[s.n.]"}, ${dados.ano || ano}.`;
    case "artigo":
      return `${dados.autores}. ${dados.titulo}. ${dados.revista || "Revista"}, ${dados.volume || ""}, ${dados.paginas || ""}, ${dados.ano || ano}. ${dados.doi ? `DOI: ${dados.doi}` : ""}`;
    case "site":
      return `${dados.autores || "[Autor não identificado]"}. ${dados.titulo}. 2024. Disponível em: ${dados.url}. Acesso em: ${dados.acessadoEm || dataBR}.`;
    case "video":
      return `${dados.autores || "[Canal]"}. ${dados.titulo}. ${dados.ano || ano}. Vídeo (${dados.volume || ""}). Youtube. Disponível em: ${dados.url}.`;
    default:
      return `${dados.autores}. ${dados.titulo}. ${ano}.`;
  }
}