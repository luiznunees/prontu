// Templates de Gráficos por Tópico
// Quando o trabalho for sobre esses temas, usamos os dados automaticamente

export const GRAFICOS_POR_TOPICO: Record<string, {
  tipo: "line" | "bar" | "pie" | "doughnut";
  titulo: string;
  labels: string[];
  values: number[];
  eixoX?: string;
  eixoY?: string;
  cores?: string[];
}> = {
  // ============================================
  // FÍSICA
  // ============================================
  "lei de ohm": {
    tipo: "line",
    titulo: "Lei de Ohm: Tensão vs Corrente",
    labels: ["0V", "2V", "4V", "6V", "8V", "10V"],
    values: [0, 0.4, 0.8, 1.2, 1.6, 2.0],
    eixoX: "Tensão (V)",
    eixoY: "Corrente (A)",
  },
  "circuitos": {
    tipo: "bar",
    titulo: "Potência de Aparelhos",
    labels: ["LED", "Ventilador", "Chuveiro", "Ar Condicionado"],
    values: [10, 100, 5500, 1500],
    eixoX: "Aparelho",
    eixoY: "Potência (W)",
  },
  "movimento": {
    tipo: "line",
    titulo: "Movimento Uniforme",
    labels: ["0s", "1s", "2s", "3s", "4s", "5s"],
    values: [0, 10, 20, 30, 40, 50],
    eixoX: "Tempo (s)",
    eixoY: "Posição (m)",
  },
  "velocidade": {
    tipo: "line",
    titulo: "Velocidade vs Tempo",
    labels: ["0s", "1s", "2s", "3s", "4s", "5s"],
    values: [0, 5, 5, 5, 5, 5],
    eixoX: "Tempo (s)",
    eixoY: "Velocidade (m/s)",
  },
  // ============================================
  // GEOGRAFIA
  // ============================================
  "população": {
    tipo: "bar",
    titulo: "População Brasileira por Região",
    labels: ["Sudeste", "Nordeste", "Sul", "Norte", "Centro-Oeste"],
    values: [89, 57, 30, 19, 16],
    eixoX: "Região",
    eixoY: "População (milhões)",
  },
  "demografia": {
    tipo: "pie",
    titulo: "Distribuição da População",
    labels: ["Urbana", "Rural"],
    values: [87, 13],
    cores: ["#3498db", "#e74c3c"],
  },
  "idhm": {
    tipo: "bar",
    titulo: "IDHM por Região",
    labels: ["Sudeste", "Nordeste", "Sul", "Norte", "Centro-Oeste"],
    values: [0.75, 0.67, 0.73, 0.67, 0.71],
    eixoX: "Região",
    eixoY: "IDHM",
  },
  // ============================================
  // BIOLOGIA
  // ============================================
  "crescimento bacterial": {
    tipo: "line",
    titulo: "Crescimento Bacteriano",
    labels: ["0h", "2h", "4h", "6h", "8h", "10h"],
    values: [100, 200, 450, 900, 1800, 3600],
    eixoX: "Tempo (h)",
    eixoY: "Colônias",
  },
  " fotossíntese": {
    tipo: "line",
    titulo: "Fotossíntese vs Luz",
    labels: ["0%", "20%", "40%", "60%", "80%", "100%"],
    values: [0, 25, 55, 80, 95, 100],
    eixoX: "Intensidade da Luz (%)",
    eixoY: "Taxa de Fotossíntese",
  },
  // ============================================
  // QUÍMICA
  // ============================================
  "tabela periódica": {
    tipo: "bar",
    titulo: "Eletronegatividade",
    labels: ["H", "C", "N", "O", "F"],
    values: [2.1, 2.55, 3.04, 3.44, 3.98],
    eixoX: "Elemento",
    eixoY: "Eletronegatividade",
  },
  "ebulição": {
    tipo: "bar",
    titulo: "Ponto de Ebulição",
    labels: ["Água", "Álcool", "Mercúrio", "Ferro", "Ouro"],
    values: [100, 78, 357, 2861, 2966],
    eixoX: "Substância",
    eixoY: "Temperatura (°C)",
  },
  // ============================================
  // MATEMÁTICA
  // ============================================
  "função quadrática": {
    tipo: "line",
    titulo: "Função Quadrática y = x²",
    labels: ["-3", "-2", "-1", "0", "1", "2", "3"],
    values: [9, 4, 1, 0, 1, 4, 9],
    eixoX: "x",
    eixoY: "y = x²",
  },
  "função linear": {
    tipo: "line",
    titulo: "Função Linear y = 2x",
    labels: ["0", "1", "2", "3", "4", "5"],
    values: [0, 2, 4, 6, 8, 10],
    eixoX: "x",
    eixoY: "y = 2x",
  },
  // ============================================
  // HISTÓRIA
  // ============================================
  "população mundial": {
    tipo: "line",
    titulo: "Crescimento Populacional",
    labels: ["1950", "1970", "1990", "2010", "2020"],
    values: [2.5, 3.7, 5.3, 7.0, 7.9],
    eixoX: "Ano",
    eixoY: "Bilhões de pessoas",
  },
};

// Função para detectar qual gráfico usar
export function detectarGrafico(titulo: string, conteudo: string, disciplina: string) {
  const texto = (titulo + " " + conteudo).toLowerCase();
  
  for (const [palavraChave, grafico] of Object.entries(GRAFICOS_POR_TOPICO)) {
    if (texto.includes(palavraChave)) {
      return grafico;
    }
  }
  
  return null;
}