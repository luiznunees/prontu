// Exemplos de gráficos Recharts para o Prontu - UI Generativa
// ============================================================================

const EXEMPLOS = [
  {
    titulo: "Física - Lei de Ohm",
    descricao: "Gráfico de linha: Tensão vs Corrente",
    topico: "Circuitos Elétricos",
  },
  {
    titulo: "Física - Movimento Uniforme", 
    descricao: "Gráfico de linha: Posição vs Tempo",
    topico: "Cinemática",
  },
  {
    titulo: "Matemática - Função Quadrática",
    descricao: "Gráfico de parábola y = x²",
    topico: "Funções",
  },
  {
    titulo: "Geografia - População Brasileira",
    descricao: "Gráfico de barras",
    topico: "Demografia",
  },
  {
    titulo: "Biologia - Crescimento Bacteriano",
    descricao: "Gráfico de área exponencial",
    topico: "Microbiologia",
  },
  {
    titulo: "Química - Tabela Periódica",
    descricao: "Gráfico de barras empilhadas",
    topico: "Estrutura Atômica",
  },
];

console.log("======================================================================");
console.log("🎨 EXEMPLOS DE GRÁFICOS - UI GENERATIVA COM RECHARTS");
console.log("======================================================================\n");

EXEMPLOS.forEach((ex, i) => {
  console.log(`${i + 1}. ${ex.titulo}`);
  console.log(`   📚 ${ex.topico}`);
  console.log(`   📈 ${ex.descricao}\n`);
});

console.log("======================================================================");
console.log("📝 EXEMPLO COMPLETO DE CÓDIGO");
console.log("======================================================================");

console.log(`
// ============================================
// 🔌 Física: Lei de Ohm
// ============================================
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const LEI_OHM_DATA = [
  { volts: 0, amperes: 0 },
  { volts: 2, amperes: 0.4 },
  { volts: 4, amperes: 0.8 },
  { volts: 6, amperes: 1.2 },
  { volts: 8, amperes: 1.6 },
  { volts: 10, amperes: 2.0 },
];

function GraficoLeiOhm() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={LEI_OHM_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="volts" label={{ value: 'Tensão (V)', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Corrente (A)', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="amperes" 
          stroke="#8884d8" 
          name="Corrente (A)"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ============================================
// 🌍 Geografia: População por Região  
// ============================================
import { BarChart, Bar, Cell } from 'recharts';

const POPULACAO_DATA = [
  { regiao: 'Sudeste', populacao: 89012440 },
  { regiao: 'Nordeste', populacao: 57344099 },
  { regiao: 'Sul', populacao: 29975984 },
  { regiao: 'Norte', populacao: 18901571 },
  { regiao: 'Centro-Oeste', populacao: 16282171 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function GraficoPopulacao() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={POPULACAO_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="regiao" />
        <YAxis label={{ value: 'População', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => value.toLocaleString()} />
        <Legend />
        <Bar dataKey="populacao" name="População" fill="#8884d8">
          {POPULACAO_DATA.map((entry, index) => (
            <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================
// 📊 Tipos de Gráficos Suportados
// ============================================
// LineChart  - Sequências, tendências
// BarChart  - Comparações, rankings
// PieChart - Proporções, percentuais
// AreaChart - Acúmulo, crescimento
// ScatterPlot - Correlação
// ComposedChart - Múltiplos tipos

// ============================================
// Como a IA Vai Gerar
// ============================================
// 1. Detectar topik que precisavisualização
// 2. Selecionar tipo de gráfico adequado
// 3. Gerar dados realistas
// 4. Criar código Recharts
// 5. Renderizar como preview
// 6. Converter para imagem no PDF
`);

console.log("======================================================================");
console.log("✅ PRONTO PARA IMPLEMENTAÇÃO!");
console.log("======================================================================");
console.log(`
INSTALAÇÃO:
  npm install recharts

ESTRATÉGIA:
1. Prompt melhorado para incluir gráfico
2. Gemini gera dados + código JSX
3. Renderizar componente React
4. Capturar como imagem (html2canvas)
5. Incluir no PDF
`);