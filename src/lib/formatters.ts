/**
 * Capitaliza cada palavra de um nome, respeitando preposições.
 * Ex: "joao da silva" -> "João da Silva"
 */
export function formatNome(nome: string): string {
  const preposicoes = ["da", "de", "do", "das", "dos", "e"];
  return nome
    .trim()
    .toLowerCase()
    .split(" ")
    .map((palavra, i) => {
      if (i > 0 && preposicoes.includes(palavra)) return palavra;
      return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    })
    .join(" ");
}

/**
 * Capitaliza e corrige nomes de instituições.
 */
export function formatEscola(escola: string): string {
  // Por ora igual ao nome, pode ser expandido para tratar siglas ou abreviações
  return formatNome(escola);
}

/**
 * Normaliza o formato da série escolar.
 * Ex: "1 medio" -> "1° Ano do Ensino Médio"
 */
export function formatSerie(serie: string): string {
  const s = serie.trim().toLowerCase();
  
  // Extrai o número ou utiliza o texto original se não houver número
  const numMatch = s.match(/\d+/);
  const num = numMatch ? numMatch[0] : "";
  const ordinal = num ? `${num}°` : "";

  if (s.includes("fund") || s.includes("ef")) {
    return `${ordinal} Ano do Ensino Fundamental`;
  }
  if (s.includes("med") || s.includes("em") || s.includes("medio") || s.includes("médio")) {
    return `${ordinal} Ano do Ensino Médio`;
  }

  // Fallback: Capitaliza cada palavra
  return serie
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Mapeia cidades comuns para seus formatos com acentuação correta.
 */
const cidadesMap: Record<string, string> = {
  "sao paulo": "São Paulo",
  "rio de janeiro": "Rio de Janeiro",
  "belo horizonte": "Belo Horizonte",
  brasilia: "Brasília",
  fortaleza: "Fortaleza",
  salvador: "Salvador",
  curitiba: "Curitiba",
  manaus: "Manaus",
  recife: "Recife",
  "porto alegre": "Porto Alegre",
  goiania: "Goiânia",
  belem: "Belém",
  florianopolis: "Florianópolis",
  maceio: "Maceió",
  natal: "Natal",
  teresina: "Teresina",
  "campo grande": "Campo Grande",
  "joao pessoa": "João Pessoa",
  aracaju: "Aracaju",
  "porto velho": "Porto Velho",
  macapa: "Macapá",
  "boa vista": "Boa Vista",
  palmas: "Palmas",
  "rio branco": "Rio Branco",
};

export function formatCidade(cidade: string): string {
  const key = cidade.trim().toLowerCase();
  return cidadesMap[key] ?? formatNome(cidade);
}
