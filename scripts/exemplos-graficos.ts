// Exemplos de gráficos Recharts que a IA pode gerar para trabalhos escolares
// Cada exemplo inclui dados realistas e código JSX completo

// =====================================================
// EXEMPLO 1: Física - Lei de Ohm (Tensão vs Corrente)
// =====================================================
const LEI_OHM_DATA = [
  { volts: 0, amperes: 0 },
  { volts: 2, amperes: 0.4 },
  { volts: 4, amperes: 0.8 },
  { volts: 6, amperes: 1.2 },
  { volts: 8, amperes: 1.6 },
  { volts: 10, amperes: 2.0 },
];

// Código gerado:
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
//
// <ResponsiveContainer width="100%" height={300}>
//   <LineChart data={LEI_OHM_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//     <CartesianGrid strokeDasharray="3 3" />
//     <XAxis dataKey="volts" label={{ value: 'Tensão (V)', position: 'insideBottom', offset: -5 }} />
//     <YAxis label={{ value: 'Corrente (A)', angle: -90, position: 'insideLeft' }} />
//     <Tooltip />
//     <Legend />
//     <Line type="monotone" dataKey="amperes" stroke="#8884d8" name="Corrente (A)" />
//   </LineChart>
// </ResponsiveContainer>

// =====================================================
// EXEMPLO 2: Física - Movimento Uniforme (Posição vs Tempo)
// =====================================================
const MOVIMENTO_DATA = [
  { tempo: 0, posicao: 0 },
  { tempo: 1, posicao: 10 },
  { tempo: 2, posicao: 20 },
  { tempo: 3, posicao: 30 },
  { tempo: 4, posicao: 40 },
  { tempo: 5, posicao: 50 },
];

// Código gerado:
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
//
// <ResponsiveContainer width="100%" height={300}>
//   <LineChart data={MOVIMENTO_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//     <CartesianGrid strokeDasharray="3 3" />
//     <XAxis dataKey="tempo" label={{ value: 'Tempo (s)', position: 'insideBottom', offset: -5 }} />
//     <YAxis label={{ value: 'Posição (m)', angle: -90, position: 'insideLeft' }} />
//     <Tooltip />
//     <Legend />
//     <Line type="monotone" dataKey="posicao" stroke="#82ca9d" name="Posição (m)" />
//   </LineChart>
// </ResponsiveContainer>

// =====================================================
// EXEMPLO 3: Geografia - População por Região Brasil
// =====================================================
const POPULACAO_REGIAO = [
  { nome: 'Sudeste', populacao: 89012440 },
  { nome: 'Nordeste', populate: 57344099 },
  { nome: 'Sul', populacao: 29975984 },
  { nome: 'Norte', populacao: 18901571 },
  { nome: 'Centro-Oeste', populacao: 16282171 },
];

// Código gerado:
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
//
// <ResponsiveContainer width="100%" height={300}>
//   <BarChart data={POPULACAO_REGIAO} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//     <CartesianGrid strokeDasharray="3 3" />
//     <XAxis dataKey="nome" />
//     <YAxis label={{ value: 'População', angle: -90, position: 'insideLeft' }} />
//     <Tooltip formatter={(value) => value.toLocaleString()} />
//     <Legend />
//     <Bar dataKey="populacao" name="População">
//       {POPULACAO_REGIAO.map((entry, index) => (
//         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//       ))}
//     </Bar>
//   </BarChart>
// </ResponsiveContainer>

// =====================================================
// EXEMPLO 4: Biologia - Crescimento Bacteriano
// =====================================================
const CRESCIMENTO_BACTERIAS = [
  { hora: 0, bacteria: 100 },
  { hora: 2, bacteria: 200 },
  { hora: 4, bacteria: 450 },
  { hora: 6, bacteria: 900 },
  { hora: 8, bacteria: 1800 },
  { hora: 10, bacteria: 3600 },
];

// Código gerado:
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { scaleLog } from 'd3-scale';
//
// <ResponsiveContainer width="100%" height={300}>
//   <AreaChart data={CRESCIMENTO_BACTERIAS} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//     <CartesianGrid strokeDasharray="3 3" />
//     <XAxis dataKey="hora" label={{ value: 'Tempo (h)', position: 'insideBottom', offset: -5 }} />
//     <YAxis label={{ value: 'Colônias', angle: -90, position: 'insideLeft' }} />
//     <Tooltip />
//     <Legend />
//     <Area type="monotone" dataKey="bacteria" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
//   </AreaChart>
// </ResponsiveContainer>

// =====================================================
// EXEMPLO 5: Química - Distribuição Eletrônica
// =====================================================
const ELEMENTOS_DADOS = [
  { elemento: 'H', camada1: 1, camada2: 0 },
  { elemento: 'C', camada1: 2, camada2: 4 },
  { elemento: 'N', camada1: 2, camada2: 5 },
  { elemento: 'O', camada1: 2, camada2: 6 },
  { elemento: 'Ne', camada1: 2, camada2: 8 },
];

// Código gerado:
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
//
// <ResponsiveContainer width="100%" height={300}>
//   <BarChart data={ELEMENTOS_DADOS} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//     <CartesianGrid strokeDasharray="3 3" />
//     <XAxis dataKey="elemento" />
//     <YAxis label={{ value: 'Elétrons', angle: -90, position: 'insideLeft' }} />
//     <Tooltip />
//     <Legend />
//     <Bar dataKey="camada1" stackId="a" fill="#8884d8" name="Camada 1" />
//     <Bar dataKey="camada2" stackId="a" fill="#82ca9d" name="Camada 2" />
//   </BarChart>
// </ResponsiveContainer>

// =====================================================
// EXEMPLO 6: Matemática - Função Quadrática (Parábola)
// =====================================================
const PARABOLA_DATA = [
  { x: -3, y: 9 }, { x: -2, y: 4 }, { x: -1, y: 1 },
  { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 4 }, { x: 3, y: 9 },
];

// Código gerado:
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
// import { ComposedChart, Scatter } from 'recharts';
//
// <ResponsiveContainer width="100%" height={300}>
//   <LineChart data={PARABOLA_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//     <CartesianGrid strokeDasharray="3 3" />
//     <XAxis dataKey="x" label={{ value: 'x', position: 'insideBottom', offset: -5 }} />
//     <YAxis label={{ value: 'y = x²', angle: -90, position: 'insideLeft' }} />
//     <Tooltip />
//     <Legend />
//     <ReferenceLine y={0} stroke="#000" />
//     <ReferenceLine x={0} stroke="#000" />
//     <Line type="monotone" dataKey="y" stroke="#ff7300" name="y = x²" />
//   </LineChart>
// </ResponsiveContainer>

// =====================================================
// EXEMPLO 7: Ciências - Temperatura de Ebulição
// =====================================================
const EBULICAO_DATA = [
  { substancia: 'Água', temp: 100 },
  { substancia: 'Álcool', temp: 78 },
  { substancia: 'Mercúrio', temp: 357 },
  { substancia: 'Ferro', temp: 2861 },
  { substancia: 'Ouro', temp: 2966 },
];

// Código gerado:
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
// const CORES = ['#3498db', '#e74c3c', '#95a5a6', '#7f8c8d', '#f39c12'];
//
// <ResponsiveContainer width="100%" height={300}>
//   <BarChart data={EBULICAO_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
//     <CartesianGrid strokeDasharray="3 3" />
//     <XAxis type="number" label={{ value: 'Temperatura (°C)', position: 'insideBottom', offset: 0 }} />
//     <YAxis type="category" dataKey="substancia" width={50} />
//     <Tooltip formatter={(value) => `${value}°C`} />
//     <Legend />
//     <Bar dataKey="temp" name="Temp. Ebulição (°C)">
//       {EBULICAO_DATA.map((entry, index) => (
//         <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
//       ))}
//     </Bar>
//   </BarChart>
// </ResponsiveContainer>

// =====================================================
// RESUMO: Como implementar no Prontu
// =====================================================
//
// 1. Instalar recharts: npm install recharts
//
// 2. O Gemini deve gerar:
//    - Component JSX com dados declarados
//    - Use sempre ResponsiveContainer
//    - Defina width="100%" e height={300}
//
// 3. Adicionar ao trabalho:
//    - Detectar topik que precisa de visualização
//    - Gerar código Recharts junto com texto
//    - Renderizar como componente React
//
// 4. Preview do PDF:
//    - Usar html2canvas ou similar para renderizar o componente
//    - Converter para imagem no PDF
//
console.log("Exemplos de gráficos Recharts definidos!");
console.log("Execute este script para ver os exemplos gerados.");