import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const EXEMPLOS_TOPICOS = [
  {
    disciplina: "Física",
    topico: "Lei de Ohm - Tensão vs Corrente",
    contexto: "Gráfico de linha mostrando a relação tensão-corrente"
  },
  {
    disciplina: "Física", 
    topico: "Movimento Uniforme - Posição vs Tempo",
    contexto: "Gráfico de linha showing posição em função do tempo"
  },
  {
    disciplina: "Matemática",
    topico: "Função Quadrática",
    contexto: "Gráfico de parábola com vértice highlighted"
  },
  {
    disciplina: "Química",
    topico: "Tabela Periódica - Eletronegatividade",
    contexto: "Gráfico de barras comparando elementos"
  },
  {
    disciplina: "Geografia",
    topico: "População Brasileira por Região",
    contexto: "Gráfico de pizza ou rosca"
  },
  {
    disciplina: "Biologia", 
    topico: "Crescimento Bacteriano",
    contexto: "Gráfico exponencial"
  }
];

const promptBase = `Gere código ReactJS usando a biblioteca Recharts (https://recharts.org) para visualização de dados escolares.

REGRAS OBRIGATÓRIAS:
1. Use APENAS componentes: LineChart, BarChart, PieChart, AreaChart do Recharts
2. Use dados realistas baseados no contexto: {contexto}
3. O código deve ser completo e funcional
4. Inclua título e legend
5. Use cores adequadas para educação

Retorne APENAS código JSX, sem markdown ou explicação extra.

Exemplo de estrutura:
<LineChart width={400} height={300} data={data}>
  <XAxis dataKey="x" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="y" stroke="#8884d8" />
</LineChart>

Contexto: {contexto}
Disciplina: {disciplina}
Tópico: {topico}`;

async function gerarExemploGrafico(exemplo: typeof EXEMPLOS_TOPICOS[0]) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 8192,
    },
  });

  const prompt = promptBase
    .replace("{contexto}", exemplo.contexto)
    .replace("{disciplina}", exemplo.disciplina)
    .replace("{topico}", exemplo.topico);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  console.log(`\n${"=".repeat(60)}`);
  console.log(`📊 ${exemplo.disciplina} - ${exemplo.topico}`);
  console.log("=".repeat(60));
  console.log(text);
  console.log("=".repeat(60));
}

async function main() {
  console.log("🎨 Gerando exemplos de gráficos com Recharts...\n");

  for (const exemplo of EXEMPLOS_TOPICOS) {
    await gerarExemploGrafico(exemplo);
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\n✅ Exemplos gerados!");
}

main().catch(console.error);