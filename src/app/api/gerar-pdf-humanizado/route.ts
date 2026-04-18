import { NextRequest, NextResponse } from "next/server";
import { buildPDF } from "@/lib/pdf-builder";
import { generateCapaBackground } from "@/lib/image-gen";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Exigir conta para gerar
    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      );
    }

    const { trabalhoOriginal, textoHumanizado, config } = await req.json();

    if (!trabalhoOriginal || !textoHumanizado || !config) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
    }

    // Dividir texto humanizado de volta em seções
    // O humanizador retorna texto com de quebra de linhas (\n\n)
    const paragrafos = textoHumanizado.split(/\n\s*\n/).filter((p: string) => p.trim() !== "");
    
    // Alocar parágrafos nas seções baseadas na quantidade original
    const numSecoes = trabalhoOriginal.secoes.length;
    const secoesHumanizadas = trabalhoOriginal.secoes.map((secaoOriginal: any, i: number) => {
      // Quantos parágrafos para essa secao? Aproximadamente (total / proporção)
      const isUltima = i === numSecoes - 1;
      const paragrafosPorSecao = Math.floor(paragrafos.length / numSecoes);
      
      const start = i * paragrafosPorSecao;
      const end = isUltima ? paragrafos.length : start + paragrafosPorSecao;
      
      const conteudo = paragrafos.slice(start, end).join("\n\n") || secaoOriginal.conteudo;
      
      return {
        ...secaoOriginal,
        conteudo
      };
    });

    const trabalhoHumnanizado = {
      ...trabalhoOriginal,
      secoes: secoesHumanizadas
    };

    console.log("🎨 Gerando capa para o PDF Humanizado...");
    // Config da Capa reusa a função
    const configCapa = {
      nomeAluno: config.nomeAluno,
      escola: config.escola,
      serie: config.serie,
      cidade: config.cidade,
      ano: new Date().getFullYear().toString()
    };
    
    const capaBuffer = await generateCapaBackground(trabalhoOriginal.titulo, config.disciplina, configCapa);

    console.log("📄 Montando PDF Humanizado...");
    const pdfBytes = await buildPDF({
      trabalho: trabalhoHumnanizado,
      templateId: config.templateId || "classico",
      config: {
        ...configCapa,
        disciplina: config.disciplina
      }
    });

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="trabalho-humanizado-${Date.now()}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Erro crítico na geração do PDF Humanizado:", error);
    return NextResponse.json(
      { error: error.message || "Ocorreu um erro interno ao processar." },
      { status: 500 }
    );
  }
}
