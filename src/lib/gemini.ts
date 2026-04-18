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

export interface GraficoData {
  tipo?: "line" | "bar" | "pie" | "doughnut" | "area";
  labels?: string[];
  values?: number[];
  titulo?: string;
  eixoX?: string;
  eixoY?: string;
  cores?: string[];
}

export interface TrabalhoGerado {
  titulo: string;
  tema: string;
  disciplina: string;
  secoes: Secao[];
  referencias: string[];
  palavrasChave: string[];
  grafico?: GraficoData;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODELS = ["gemini-2.5-flash", "gemini-1.5-flash"];

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

  const prompt = `Gere trabalho escolar BR com negrito, exemplos e gráficos quando aplicável.
Use **palavra** para negrito.
Inclua exemplos práticos e exercício resolvido.
Se o tópico tiver dados numéricos (como populações, temperaturas, forças), gere um objeto "grafico" com os dados.
Retorne JSON: {"titulo":"txt","tema":"txt","disciplina":"${disciplina}","secoes":[{"titulo":"INTRODUÇÃO","conteudo":"txt **destaque**"},{"titulo":"DESENVOLVIMENTO","conteudo":"Exemplo... [gráfico: tipo=bar, dados={labels:[], values:[], titulo=txt]"},{"titulo":"CONCLUSÃO","conteudo":"txt"}],"referencias":["fonte"],"palavrasChave":["palavra"],"grafico":{"tipo":"line|bar|pie","labels":[], "values":[],"titulo":"txt"}}
Enunciado: ${enunciado}`;

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
      
      try {
        // Limpar e extrair JSON
        let jsonStr = responseText;
        
        // Remover markdown
        jsonStr = jsonStr.replace(/```json|```/g, "").replace(/```/g, "").trim();
        
        // Encontrar o JSON válido
        const start = jsonStr.indexOf("{");
        const end = jsonStr.lastIndexOf("}");
        
        if (start >= 0 && end > start) {
          jsonStr = jsonStr.substring(start, end + 1);
          
          // Limpar sequências inválidas comuns
          jsonStr = jsonStr.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
          
          return JSON.parse(jsonStr) as TrabalhoGerado;
        } else {
          throw new Error("JSON não encontrado");
        }
      } catch (parseError: any) {
        console.error("Parse erro:", parseError.message);
        
        // Retornar trabalho mínimo
        return {
          titulo: enunciado.substring(0, 50),
          tema: disciplina,
          disciplina,
          secoes: [
            { titulo: "INTRODUÇÃO", conteudo: enunciado },
            { titulo: "DESENVOLVIMENTO", conteudo: "Conteúdo gerado." },
            { titulo: "CONCLUSÃO", conteudo: "Conclusão." }
          ],
          referencias: ["IBGE"],
          palavrasChave: [disciplina]
        };
      }
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