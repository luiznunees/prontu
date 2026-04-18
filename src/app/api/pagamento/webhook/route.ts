import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const webhookSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;

    if (!webhookSecret || authHeader !== `Bearer ${webhookSecret}`) {
      console.warn("[Webhook] Tentativa não autorizada. Header:", authHeader);
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { event, data } = body;

    console.log(`[Webhook AbacatePay] Evento recebido: ${event}`);

    if (event === "pix.paid") {
      const { metadata, id: pixId } = data;
      const userId = metadata?.userId;
      const creditos = metadata?.creditos;

      if (!userId) {
        console.error("Webhook sem userId:", { userId, creditos });
        return NextResponse.json({ error: "Metadata ausente" }, { status: 400 });
      }

      // Chamar RPC que faz tudo em uma transação atômica (adicionar créditos + marcar pago)
      const supabase = createServerSupabaseClient();
      
      const { data: result, error } = await supabase.rpc('processar_pagamento_pix', {
        p_pix_id: pixId,
        p_user_id: userId,
        p_creditos: creditos || 5
      });

      if (error) {
        console.error("[Webhook] Erro ao processar pagamento:", error);
        return NextResponse.json({ error: "Erro ao processar pagamento" }, { status: 500 });
      }

      if (!result?.sucesso) {
        console.log(`[Webhook] Pagamento ${pixId} já foi processado (idempotência).`);
        return NextResponse.json({ received: true });
      }

      console.log(`[Webhook] ${result.creditos_adicionados} créditos adicionados ao usuário ${userId}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("Erro no Webhook AbacatePay:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
