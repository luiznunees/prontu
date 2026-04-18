const BASE = process.env.ABACATEPAY_BASE_URL || 'https://api.abacatepay.com';
const TOKEN = process.env.ABACATEPAY_TOKEN;

const headers = {
  'accept': 'application/json',
  'authorization': `Bearer ${TOKEN}`,
  'content-type': 'application/json',
};

export const PACOTES = {
  starter: { creditos: 5,  valor: 1490, nome: 'Starter — 5 créditos',  valorFormatado: 'R$ 14,90', porCredito: 'R$2,98/trabalho' },
  popular: { creditos: 15, valor: 3490, nome: 'Popular — 15 créditos', valorFormatado: 'R$ 34,90', porCredito: 'R$2,33/trabalho' },
  pro:     { creditos: 30, valor: 5990, nome: 'Pro — 30 créditos',     valorFormatado: 'R$ 59,90', porCredito: 'R$2,00/trabalho' },
} as const;

export type PacoteKey = keyof typeof PACOTES;

// Criar cliente na AbacatePay
export async function criarCliente(dados: {
  name: string;
  email: string;
  cellphone: string;
  taxId: string;
}) {
  const res = await fetch(`${BASE}/v1/customer/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify(dados),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

// Criar QR Code PIX para compra de pacote de créditos
export async function criarPixPacote(dados: {
  userId: string;
  pacote: PacoteKey;
  nomeAluno: string;
  email: string;
  celular: string;
  cpf: string;
}) {
  const pacote = PACOTES[dados.pacote];

  const body = {
    amount: pacote.valor,
    expiresIn: 3600, // 1 hora
    description: pacote.nome,
    customer: {
      name: dados.nomeAluno,
      cellphone: dados.celular,
      email: dados.email,
      taxId: dados.cpf,
    },
    metadata: {
      userId: dados.userId,
      pacote: dados.pacote,
      creditos: pacote.creditos,
    },
  };

  const res = await fetch(`${BASE}/v1/pixQrCode/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  
  const json = await res.json();
  console.log("[AbacatePay] Response:", JSON.stringify(json));
  
  if (json.error) {
    console.error("[AbacatePay] Erro:", json.error);
    throw new Error(json.error);
  }
  if (!json.data) {
    console.error("[AbacatePay] Sem data:", json);
    throw new Error("Erro ao gerar PIX");
  }
  return json.data;
  // Retorna: { id, amount, status, brCode, brCodeBase64, expiresAt }
}

// Checar status do PIX
export async function checarStatusPix(pixId: string) {
  const res = await fetch(`${BASE}/v1/pixQrCode/check?id=${pixId}`, {
    headers,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data; // { status: "PENDING" | "PAID" | "EXPIRED", expiresAt }
}
