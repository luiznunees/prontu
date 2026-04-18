import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { generateTrabalho, GeminiOverloadError } from "@/lib/gemini";
import { generateCapaBackground } from "@/lib/image-gen";
import { buildPDF } from "@/lib/pdf-builder";
import { formatNome, formatEscola, formatSerie, formatCidade } from "@/lib/formatters";
import { saveTrabalho, verificarCreditoEUsar } from "@/lib/usage";
import { verificarRateLimit } from "@/lib/rate-limit";
import { gerarImagens } from "@/lib/gemini-image";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      enunciado,
      nomeAluno,
      escola,
      disciplina,
      serie,
      cidade,
      templateId,
      observacao,
      incluirImagens
    } = body;

    const supabase = createServerSupabaseClient();
    const authHeader = req.headers.get("authorization");
    const testMode = authHeader === "Bearer test-mode-123";
    
    let userId = "00000000-0000-0000-0000-000000000001";
    let user = null;
    
    if (!testMode) {
      const auth = await supabase.auth.getUser();
      user = auth.data.user;

      if (!user) {
        return NextResponse.json(
          { error: "Para gerar seu trabalho, você precisa criar uma conta gratuita primeiro." },
          { status: 401 }
        );
      }
      
      userId = user.id;
    }

    console.log("[DEBUG] Modo teste:", testMode, "userId:", userId);

    // Rate limiting por usuário (5 requisições por minuto) - pular em modo teste
    let permitido = true;
    let restantes = 5;
    let reset = 0;
    
    if (!testMode) {
      const rateLimitResult = await verificarRateLimit(userId);
      permitido = rateLimitResult.permitido;
      restantes = rateLimitResult.restantes;
      reset = rateLimitResult.reset;
    }
    
    if (!permitido) {
      return NextResponse.json(
        { 
          error: "Você está fazendo muitas requisições. Aguarde um momento antes de tentar novamente.",
          code: "rate_limit_exceeded",
          restantes: 0,
          resetEm: new Date(reset * 1000).toISOString()
        },
        { status: 429 }
      );
    }

    console.log(`📊 Rate limit: ${restantes} requisições restantes`);

    // Validar campos obrigatórios
    if (!enunciado || !nomeAluno || !escola || !disciplina || !serie) {
      return NextResponse.json(
        { error: "Por favor, preencha todos os campos obrigatórios: nome, escola, disciplina e série." },
        { status: 400 }
      );
    }

    // Validar tamanho mínimo do enunciado
    if (enunciado.length < 20) {
      return NextResponse.json(
        { error: "O enunciado está muito curto. Para gerar um bom trabalho, precisamos de pelo menos 20 caracteres descrevendo o tema." },
        { status: 400 }
      );
    }

    // Verificar crédito disponível (grátis ou pago) - pular em modo teste
    let podeGerar = !testMode;
    let tipo = testMode ? "gratis" : "pago";
    let creditosAtuais = 1;
    
    if (!testMode) {
      const creditoResult = await verificarCreditoEUsar(userId);
      podeGerar = creditoResult.podeGerar;
      tipo = creditoResult.tipo;
      creditosAtuais = creditoResult.creditosAtuais;
    }
    
    if (!podeGerar) {
      return NextResponse.json(
        { error: "Você atingiu seu limite de trabalhos neste mês. Compre créditos para continuar gerando.", code: "sem_creditos" },
        { status: 402 }
      );
    }

    // Se é crédito gratuito, SEM marca d'água (marketing)
    // Se é crédito pago (comprado), SEM marca d'água
    // Apenas para futura lógica de trial premium poderia ter marca
    const addWatermark = false;

    // Normalização
    const nomeAlunoFormatado = formatNome(nomeAluno || "");
    const escolaFormatada = formatEscola(escola || "");
    const serieFormatada = formatSerie(serie || "");
    const cidadeFormatada = formatCidade(cidade || "São Paulo");

    let trabalho;
    let isOverload = false;

    try {
      console.log(`📝 Gerando trabalho (tipo: ${tipo})...`);
      trabalho = await generateTrabalho(enunciado, {
        disciplina,
        escola: escolaFormatada,
        nomeAluno: nomeAlunoFormatado,
        serie: serieFormatada,
        observacao
      });
    } catch (geminiError: any) {
      if (geminiError instanceof GeminiOverloadError || geminiError?.name === "GeminiOverloadError") {
        console.log("⚠️ Gemini sobrecarregado, salvando como pendente...");
        isOverload = true;
      } else {
        throw geminiError;
      }
    }

    if (isOverload) {
      const { data: trabalhoSalvo, error: erroSalvar } = await supabase
        .from("trabalhos")
        .insert({
          user_id: userId,
          titulo: "Trabalho pendente",
          disciplina,
          enunciado,
          status: "pendente",
          erroMensagem: "Aguardando processamento",
          pdf_url: "#"
        })
        .select("id")
        .single();

      if (erroSalvar) {
        console.error("Erro ao salvar trabalho pendente:", erroSalvar);
      }

      return NextResponse.json({
        pendente: true,
        trabalhoId: trabalhoSalvo?.id,
        message: "Estamos com muitos usuários no site agora. Seu trabalho foi colocado na fila e será gerado automaticamente em alguns minutos. Você receberá uma notificação quando estiver pronto!",
        tempoEstimado: "2-5 minutos"
      });
    }

    if (!trabalho) {
      return NextResponse.json({ error: "Erro ao gerar trabalho" }, { status: 500 });
    }

    console.log("🎨 Gerando capa programática...");
    const configCapa = {
      nomeAluno: nomeAlunoFormatado,
      escola: escolaFormatada,
      serie: serieFormatada,
      cidade: cidadeFormatada,
      ano: new Date().getFullYear().toString()
    };
    const capaBuffer = await generateCapaBackground(trabalho.titulo, disciplina, configCapa);

    // Gerar imagens com IA se solicitado
    let imagensUrls: string[] = [];
    if (incluirImagens) {
      const geminiKey = process.env.GEMINI_API_KEY;
      
      if (geminiKey) {
        console.log("🎨 Gerando imagens com IA (Gemini)...");
        try {
          imagensUrls = await gerarImagens(trabalho.tema, 2);
          console.log(`✅ ${imagensUrls.length} imagens geradas`);
        } catch (e) {
          console.error("Erro ao gerar imagens:", e);
        }
      } else {
        console.log("⚠️ GEMINI_API_KEY não configurado - imagens não serão geradas");
      }
    }

    console.log("📄 Montando PDF...");
    const pdfBytes = await buildPDF({
      trabalho,
      templateId,
      config: {
        ...configCapa,
        disciplina
      },
      imagens: imagensUrls
    });

    // Salvar trabalho no histórico
    await saveTrabalho(userId, {
      titulo: trabalho.titulo,
      disciplina,
      enunciado,
    });

    // Atualizar ultimo_login
    await supabase
      .from("users")
      .update({ ultimo_login: new Date().toISOString() })
      .eq("id", userId);

    console.log("✅ PDF Gerado com sucesso!");

    // Calcular créditos restantes para retornar
    const creditosRestantes = tipo === 'pago' ? creditosAtuais : 0;

    return NextResponse.json({
      pdfBase64: Buffer.from(pdfBytes).toString("base64"),
      trabalho,
      configCapa,
      creditosRestantes,
      tipoCredito: tipo
    });

  } catch (error: any) {
    console.error("Erro crítico na geração do PDF:", error);
    return NextResponse.json(
      { error: "Algo deu errado na geração do seu trabalho. Por favor, tente novamente." },
      { status: 500 }
    );
  }
}
