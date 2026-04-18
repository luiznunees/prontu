import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { randomBytes } from "crypto";

function generateReferralCode(): string {
  return "PRONTU" + randomBytes(3).toString("hex").toUpperCase();
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(req.url);
    const acao = searchParams.get("acao");

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: perfil } = await supabase
      .from("users")
      .select("indicador_id, creditos_gratis_usados")
      .eq("id", user.id)
      .single();

    if (acao === "codigo") {
      let codigo = perfil?.indicador_id;
      if (!codigo) {
        codigo = generateReferralCode();
        await supabase.from("users").update({ indicador_id: codigo }).eq("id", user.id);
      }
      return NextResponse.json({ codigo });
    }

    if (acao === "indicados") {
      const { data: indicados } = await supabase
        .from("users")
        .select("id, nome, ultimo_login")
        .eq("indicador_id", perfil?.indicador_id);

      return NextResponse.json({ indicados: indicados || [] });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (error: any) {
    console.error("Erro na API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { codigoIndicador } = body;

    if (!codigoIndicador) {
      return NextResponse.json({ error: "Código do indicador é obrigatório" }, { status: 400 });
    }

    const { data: indicador } = await supabase
      .from("users")
      .select("id")
      .eq("indicador_id", codigoIndicador)
      .single();

    if (!indicador) {
      return NextResponse.json({ error: "Código inválido" }, { status: 404 });
    }

    if (indicador.id === user.id) {
      return NextResponse.json({ error: "Não pode indicar você mesmo" }, { status: 400 });
    }

    const { data: atual } = await supabase
      .from("users")
      .select("indicador_id")
      .eq("id", user.id)
      .single();

    if (atual?.indicador_id) {
      return NextResponse.json({ error: "Você já indicatou alguém" }, { status: 400 });
    }

    await supabase
      .from("users")
      .update({ indicador_id: codigoIndicador })
      .eq("id", user.id);

    return NextResponse.json({ sucesso: true, message: "Indicação registrada! Ambos ganharam 1 crédito." });
  } catch (error: any) {
    console.error("Erro ao indicar:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}