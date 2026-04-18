import { NextRequest, NextResponse } from "next/server";
import { generateTrabalho } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { enunciado, disciplina, escola, nomeAluno, serie } = body;

    // Validações
    if (!enunciado) {
      return NextResponse.json(
        { error: "O enunciado do trabalho é obrigatório." },
        { status: 400 }
      );
    }

    if (enunciado.length < 20) {
      return NextResponse.json(
        { error: "O enunciado deve ter pelo menos 20 caracteres para gerar um bom resultado." },
        { status: 400 }
      );
    }

    // Geração do trabalho
    const trabalho = await generateTrabalho(enunciado, {
      disciplina,
      escola,
      nomeAluno,
      serie,
    });

    return NextResponse.json(trabalho, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error: any) {
    console.error("Erro no endpoint /api/gerar-trabalho:", error);
    
    return NextResponse.json(
      { error: error.message || "Ocorreu um erro interno ao gerar o trabalho." },
      { status: 500 }
    );
  }
}
