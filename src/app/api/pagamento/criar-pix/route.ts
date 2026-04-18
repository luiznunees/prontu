import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { criarPixPacote, PACOTES, PacoteKey } from "@/lib/abacatepay";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { pacote, nomeAluno, email, celular, cpf } = body as {
      pacote: PacoteKey;
      nomeAluno: string;
      email: string;
      celular: string;
      cpf: string;
    };

    if (!pacote || !nomeAluno || !email || !celular || !cpf) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    if (!PACOTES[pacote]) {
      return NextResponse.json({ error: "Pacote inválido" }, { status: 400 });
    }

    const pacoteInfo = PACOTES[pacote];

    // Criar PIX na AbacatePay
    const pixData = await criarPixPacote({
      userId: user.id,
      pacote,
      nomeAluno,
      email,
      celular,
      cpf,
    });

    // Salvar no banco com informações do pacote
    const { error } = await supabase.from("pagamentos").insert({
      user_id: user.id,
      pix_id: pixData.id,
      valor: pixData.amount,
      pacote,
      plano: "avulso", // fallback para não quebrar a coluna NOT NULL velha do banco
      creditos_comprados: pacoteInfo.creditos,
      status: "PENDING",
    });

    if (error) throw error;

    return NextResponse.json({
      pixId: pixData.id,
      qrCodeBase64: pixData.brCodeBase64,
      copiaCola: pixData.brCode,
      valor: pixData.amount,
      expiresAt: pixData.expiresAt,
      pacote,
      creditos: pacoteInfo.creditos,
      nomePacote: pacoteInfo.nome,
    });

  } catch (error: any) {
    console.error("Erro ao criar PIX:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
