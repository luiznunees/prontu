import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { checarStatusPix } from "@/lib/abacatepay";
import { adicionarCreditos } from "@/lib/usage";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pixId = searchParams.get("pixId");

    if (!pixId) {
      return NextResponse.json({ error: "pixId é obrigatório" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Consultar na AbacatePay
    const data = await checarStatusPix(pixId);

    if (data.status === "PAID") {
      // Buscar o pagamento para saber quantos créditos adicionar
      const { data: pagamento } = await supabase
        .from("pagamentos")
        .select("user_id, pacote, creditos_comprados, status")
        .eq("pix_id", pixId)
        .single();

      if (pagamento && pagamento.status !== "PAID") {
        const creditosAdicionar = pagamento.creditos_comprados || 5;

        // Adicionar créditos via RPC atômica
        await adicionarCreditos(pagamento.user_id, creditosAdicionar);

        // Marcar pagamento como pago
        await supabase.rpc('atualizar_status_pagamento', {
          p_pix_id: pixId,
          p_status: "PAID"
        });

        // Buscar saldo atualizado
        const { data: userAtualizado } = await supabase
          .from("users")
          .select("creditos")
          .eq("id", pagamento.user_id)
          .single();

        return NextResponse.json({
          status: "PAID",
          creditos_adicionados: creditosAdicionar,
          total_creditos: userAtualizado?.creditos ?? creditosAdicionar,
          pacote: pagamento.pacote,
        });
      }

      // Já estava pago (idempotência)
      const { data: userAtualizado } = await supabase
        .from("users")
        .select("creditos")
        .eq("id", pagamento?.user_id)
        .single();

      return NextResponse.json({
        status: "PAID",
        creditos_adicionados: 0,
        total_creditos: userAtualizado?.creditos ?? 0,
      });
    }

    if (data.status === "EXPIRED") {
      await supabase.rpc('atualizar_status_pagamento', {
        p_pix_id: pixId,
        p_status: "EXPIRED"
      });
      return NextResponse.json({ status: "EXPIRED" });
    }

    return NextResponse.json({ status: "PENDING" });

  } catch (error: any) {
    console.error("Erro ao checar status PIX:", error);
    return NextResponse.json({ error: "Erro ao consultar pagamento" }, { status: 500 });
  }
}
