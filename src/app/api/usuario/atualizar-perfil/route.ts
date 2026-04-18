import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { telefone, serie, nome } = body;

    const updates: Record<string, string | boolean> = {};

    if (nome) {
      updates.nome = nome.trim();
    }

    if (serie) {
      updates.serie = serie.trim();
    }

    if (telefone) {
      // Sanitizar: manter apenas dígitos
      const telefoneLimpo = telefone.replace(/\D/g, "");
      if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
        return NextResponse.json(
          { error: "Telefone inválido. Use o formato (00) 0 0000-0000" },
          { status: 400 }
        );
      }
      updates.telefone = telefoneLimpo;
      updates.telefone_coletado = true;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
    }

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao salvar perfil" },
      { status: 500 }
    );
  }
}
