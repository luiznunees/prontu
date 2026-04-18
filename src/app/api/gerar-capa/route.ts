import { NextRequest, NextResponse } from "next/server";
import { generateCapaBackground } from "@/lib/image-gen";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tema, disciplina = "Outra" } = body;

    if (!tema) {
      return NextResponse.json(
        { error: "O tema é obrigatório para gerar a capa." },
        { status: 400 }
      );
    }

    const buffer = await generateCapaBackground(tema, disciplina, {
      nomeAluno: "Estudante",
      escola: "Escola",
      serie: "Série",
      cidade: "São Paulo",
      ano: new Date().getFullYear().toString()
    });

    if (buffer) {
      const imagemBase64 = buffer.toString("base64");
      return NextResponse.json({
        imagemBase64,
        formato: "png",
      }, { status: 200 });
    }

    // Fallback: Gemini falhou
    return NextResponse.json({
      imagemBase64: null,
      corFundo: "#1A3FFF", // prontu-blue
      aviso: "Usando fallback visual devido a falha na geração de imagem."
    }, { status: 200 });

  } catch (error: any) {
    console.error("Erro no endpoint /api/gerar-capa:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor de imagem." },
      { status: 500 }
    );
  }
}
