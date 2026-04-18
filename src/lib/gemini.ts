import { GoogleGenerativeAI } from "@google/generative-ai";
import { withRetry, isGeminiOverloadError } from "./retry";

export class GeminiOverloadError extends Error {
  constructor() {
    super("Gemini temporariamente indisponível por sobrecarga");
    this.name = "GeminiOverloadError";
  }
}

export interface TrabalhoConfig {
  disciplina?: string;
  escola?: string;
  nomeAluno?: string;
  serie?: string;
  numeroPaginas?: number;
  observacao?: string;
  idioma?: "pt" | "en" | "es";
}

export interface Secao {
  titulo: string;
  conteudo: string;
}

export interface TrabalhoGerado {
  titulo: string;
  tema: string;
  disciplina: string;
  secoes: Secao[];
  referencias: string[];
  palavrasChave: string[];
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODELS = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];

export async function generateTrabalho(
  enunciado: string,
  config: TrabalhoConfig = {}
): Promise<TrabalhoGerado> {
  const {
    disciplina = "Geral",
    escola = "Não informada",
    nomeAluno = "Estudante",
    serie = "Não informada",
    numeroPaginas = 3,
  } = config;

  // Ajustar vocabulário conforme série
  const serieLower = serie.toLowerCase();
  let nivelVocabulario = "Ensino Médio";
  let extensaoTexto = "média";
  let exemplosDados = "IBGE, SUS, DataSUS, IPEA";
  
  if (serieLower.includes("6") || serieLower.includes("7") || serieLower.includes("8")) {
    nivelVocabulario = "Ensino Fundamental - anos finais";
    extensaoTexto = "curta";
    exemplosDados = "IBGE Censos, PNAD, sites educativos";
  } else if (serieLower.includes("1") || serieLower.includes("2") || serieLower.includes("3")) {
    nivelVocabulario = "Ensino Médio";
    extensaoTexto = "média";
    exemplosDados = "IBGE, SUS, DataSUS, IPEA";
  } else if (serieLower.includes("universit") || serieLower.includes("superior")) {
    nivelVocabulario = "Ensino Superior";
    extensaoTexto = "avançada";
    exemplosDados = "IBGE, DATASUS, науч journals, SciELO";
  }

  const prompt = `
    Você é um assistente escolar brasileiro especializado em trabalhos acadêmicos para professores.
    Gere um trabalho deivery para professor com base no enunciado: "${enunciado}"
    
    Contexto:
    - Disciplina: ${disciplina}
    - Escola: ${escola}
    - Aluno: ${nomeAluno}
    - Série/Turma: ${serie}
    - Extensão esperada: ${numeroPaginas} páginas
    ${config.observacao ? `\n\nOBSERVAÇÃO DO ALUNO:\n${config.observacao}` : ""}
    
    REGRAS OBRIGATÓRIAS para o trabalho ser aceito pelo professor:
    1. **Negrito**: Use **palavra em negrito** para 강조 conceitos importantes
    2. **Listas numeradas**: Para passos, itens ou sequências (ex: "1. Primeiro passo...", "2. Segundo passo...")
    3. **Estrutura clara**: Cada parágrafo com uma ideia principal
    4. **Exemplos concretos**: Dados reais de fontes confiáveis (${exemplosDados})
    5. **Relevância imediata**: Explique logo POR QUE o tema é importante para ${disciplina}
    6. **Tom尾 formal mas acessível**: Como um estudanteseriai escreveria
    7. **Conclusões práticas**: O que o aluno aprendeu e como pode aplicar
    
    Formato JSON (apenas):
    {
      "titulo": "Título do trabalho",
      "tema": "Palavras-chave para capa",
      "disciplina": "${disciplina}",
      "secoes": [
        { 
          "titulo": "INTRODUÇÃO", 
          "conteudo": "Texto curto explicando tema e relevância para ${disciplina}. Use **negrito** para conceitos-chave." 
        },
        { 
          "titulo": "DESENVOLVIMENTO", 
          "conteudo": "Explicação com exemplos, dados. Use listas numeradas para passos: 1. Primeiro passo 2. Segundo passo. Use **negrito** para enfatizar." 
        },
        { 
          "titulo": "CONCLUSÃO", 
          "conteudo": "Resumo do que aprendeu com conclusão prática." 
        }
      ],
      "referencias": ["IBGE. Site oficial. Acesso em 2025.", "Outro fonte confiável."],
      "palavrasChave": ["palavra1", "palavra2"]
    }
  `;

  let lastError: Error | null = null;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const cleanedResponse = responseText.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedResponse) as TrabalhoGerado;
    } catch (apiError: any) {
      const is503 = apiError?.status === 503 || apiError?.message?.includes("503");
      const isOverload = apiError?.message?.includes("high demand") || apiError?.message?.includes("temporarily unavailable");
      
      console.error(`Erro no modelo ${modelName}:`, apiError?.message);
      
      if (is503 || isOverload) {
        lastError = new GeminiOverloadError();
        continue;
      }
      
      lastError = apiError;
    }
  }

  throw lastError || new GeminiOverloadError();
}
