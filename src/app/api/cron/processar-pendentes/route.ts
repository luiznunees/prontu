import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { generateTrabalho } from "@/lib/gemini";
import { generateCapaBackground } from "@/lib/image-gen";
import { buildPDF } from "@/lib/pdf-builder";

const CRON_SECRET = process.env.CRON_SECRET || "my_cron_secret_001";

export async function POST(req: NextRequest) {
  try {
    // Verificação de auth opcional (aceita sem auth para cron simples)
    const authHeader = req.headers.get("authorization");
    const isAuth = authHeader === `Bearer ${CRON_SECRET}` || authHeader === `Bearer my_cron_secret_001`;
    
    // Se não tiver auth, permite apenas em desenvolvimento local
    if (!isAuth && process.env.NODE_ENV === "production") {
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data: pendentes, error: erroBuscar } = await supabase
      .from("trabalhos")
      .select("id, user_id, titulo, disciplina, enunciado, tentativas")
      .eq("status", "pendente")
      .order("criado_em", { ascending: true })
      .limit(5);

    if (erroBuscar) {
      console.error("Erro ao buscar pendentes:", erroBuscar);
      return NextResponse.json({ error: erroBuscar.message }, { status: 500 });
    }

    if (!pendentes || pendentes.length === 0) {
      return NextResponse.json({ message: "Nenhum trabalho pendente" });
    }

    console.log(`📋 Processando ${pendentes.length} trabalhos pendentes...`);

    for (const lavoro of pendentes) {
      try {
        await supabase
          .from("trabalhos")
          .update({ status: "processando", tentativas: lavoro.tentativas + 1 })
          .eq("id", lavoro.id);

        const trabalho = await generateTrabalho(lavoro.enunciado, {
          disciplina: lavoro.disciplina,
        });

        const configCapa = {
          nomeAluno: "Aluno",
          escola: "Escola",
          serie: "Série",
          cidade: "São Paulo",
          ano: new Date().getFullYear().toString()
        };
        const capaBuffer = await generateCapaBackground(trabalho.titulo, trabalho.disciplina, configCapa);

        const pdfBytes = await buildPDF({
          trabalho,
          templateId: "classico",
          config: { ...configCapa, disciplina: trabalho.disciplina },
          imagens: []
        });

        await supabase
          .from("trabalhos")
          .update({
            status: "concluido",
            titulo: trabalho.titulo,
            conteudo_gerado: trabalho as any,
          })
          .eq("id", lavoro.id);

        console.log(`✅ Trabalho ${lavoro.id} processado`);
      } catch (erroProcessar: any) {
        console.error(`Erro ao processar ${lavoro.id}:`, erroProcessar.message);
        
        await supabase
          .from("trabalhos")
          .update({
            status: "erro",
            erroMensagem: erroProcessar.message
          })
          .eq("id", lavoro.id);
      }
    }

    return NextResponse.json({ 
      message: `${pendentes.length} trabalhos processados`,
      processados: pendentes.length 
    });

  } catch (error: any) {
    console.error("Erro no cron:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}