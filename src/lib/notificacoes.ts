import { createServerSupabaseClient } from "@/lib/supabase";

// Enviar WhatsApp via Evolution API
export async function enviarWhatsApp(
  telefone: string,
  mensagem: string
): Promise<boolean> {
  try {
    const { EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE } = process.env;

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE) {
      console.warn("Evolution credentials ausentes.");
      return false;
    }

    // Formatar número: remover tudo que não for dígito e adicionar 55
    const numero = telefone.replace(/\D/g, '');
    const numeroComDDD = numero.startsWith('55') ? numero : `55${numero}`;

    const res = await fetch(
      `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY
        },
        body: JSON.stringify({
          number: numeroComDDD,
          text: mensagem
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('Erro Evolution:', err);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    return false;
  }
}

// Enviar email via Resend
export async function enviarEmail(dados: {
  para: string;
  assunto: string;
  html: string;
}): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY ausente.");
      return false;
    }

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    // ATENÇÃO: Na Vercel sem domínio verificado pelo Resend, pode ser 
    // necessário alterar o e-mail from para o padrao 'onboarding@resend.dev'
    const { error } = await resend.emails.send({
      from: 'Prontu <oi@useprontu.online>',
      replyTo: 'oi@useprontu.online',
      to: dados.para,
      subject: dados.assunto,
      html: dados.html,
    });

    if (error) {
      console.error("Erro Resend API:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Exceção ao disparar e-mail:", error);
    return false;
  }
}

// Registrar notificação enviada para que o Cron não repita indevidamente
export async function registrarNotificacao(
  userId: string,
  tipo: string,
  canal: string
): Promise<void> {
  const supabase = createServerSupabaseClient();
  await supabase.from('notificacoes').insert({ user_id: userId, tipo, canal });
}

// Verificar se já houve um envio desse tipo naquele período
export async function jaEnviou(
  userId: string,
  tipo: string,
  diasAtras: number = 30
): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  const desde = new Date();
  desde.setDate(desde.getDate() - diasAtras);

  const { data } = await supabase
    .from('notificacoes')
    .select('id')
    .eq('user_id', userId)
    .eq('tipo', tipo)
    .gte('enviada_em', desde.toISOString())
    .limit(1)
    .maybeSingle(); // Pode n retornar nada se novo

  return !!data;
}
