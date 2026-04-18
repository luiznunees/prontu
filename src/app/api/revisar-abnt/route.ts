import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { revisarABNT } from "@/lib/abnt-revisor";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { trabalho } = body;

    if (!trabalho || !trabalho.secoes) {
      return NextResponse.json({ error: "Trabalho inválido" }, { status: 400 });
    }

    console.log("🔍 Revisando conformidade ABNT...");
    const resultado = await revisarABNT(trabalho);

    return NextResponse.json(resultado);
  } catch (error: any) {
    console.error("Erro ao revisar ABNT:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}