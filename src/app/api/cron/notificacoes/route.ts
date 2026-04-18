import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { enviarEmail, enviarWhatsApp, registrarNotificacao, jaEnviou } from "@/lib/notificacoes";
import { emails, mensagens } from "@/lib/mensagens";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    let processados = 0;
    let enviados = 0;

    const agora = Date.now();

    // 1. Cadastrou há 48h e ainda não gerou nenhum trabalho
    const date48h = new Date(agora - 48 * 60 * 60 * 1000).toISOString();
    const date72h = new Date(agora - 72 * 60 * 60 * 1000).toISOString();
    
    const { data: nao_geraram } = await supabase
      .from('users')
      .select('id, nome, email, telefone, total_trabalhos')
      .eq('total_trabalhos', 0)
      .lt('criado_em', date48h)
      .gt('criado_em', date72h);

    if (nao_geraram) {
      for (const u of nao_geraram) {
        processados++;
        const tipo = 'nao_gerou_48h';
        if (!(await jaEnviou(u.id, tipo))) {
          let sucesso = false;
          if (u.telefone) {
             sucesso = await enviarWhatsApp(u.telefone, mensagens.nao_gerou_48h(u.nome || "Estudante"));
             if(sucesso) await registrarNotificacao(u.id, tipo, 'whatsapp');
          }
          // Falaremos no plano original que o fallback pra nao_gerou_48h tem fallback por email se quisermos (opcional), 
          // mas focaremos no Whatsapp como manda o spec ou mandar sempre pra E-mail.
          if (u.email && !sucesso) {
             const tpl = emails.reativacao_30d(u.nome || "Estudante"); // Reaproveitando template
             sucesso = await enviarEmail({ para: u.email, assunto: "Ainda temos um crédito pra você!", html: tpl.html });
             if(sucesso) await registrarNotificacao(u.id, tipo, 'email');
          }
          if (sucesso) enviados++;
        }
      }
    }

    // 2. Gerou mas sumiu há 7 dias
    const date7d = new Date(agora - 7 * 24 * 60 * 60 * 1000).toISOString();
    const date8d = new Date(agora - 8 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: sumiram_7d } = await supabase
      .from('users')
      .select('id, nome, email, telefone')
      .gt('total_trabalhos', 0)
      .lt('ultimo_login', date7d)
      .gt('ultimo_login', date8d);

    if (sumiram_7d) {
      for (const u of sumiram_7d) {
        processados++;
        const tipo = 'gerou_sumiu_7d';
        if (!(await jaEnviou(u.id, tipo, 10))) {
          let sucesso = false;
          if (u.telefone) {
             sucesso = await enviarWhatsApp(u.telefone, mensagens.gerou_sumiu_7d(u.nome || "Estudante", "Escola"));
             if(sucesso) await registrarNotificacao(u.id, tipo, 'whatsapp');
          }
          if (sucesso) enviados++;
        }
      }
    }

    // 3. Sumiu há 30 dias (Reativação agressiva)
    const date30d = new Date(agora - 30 * 24 * 60 * 60 * 1000).toISOString();
    const date31d = new Date(agora - 31 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: reativacao } = await supabase
      .from('users')
      .select('id, nome, email, telefone')
      .lt('ultimo_login', date30d)
      .gt('ultimo_login', date31d);

    if (reativacao) {
      for (const u of reativacao) {
         processados++;
         const tipo = 'reativacao_30d';
         if (!(await jaEnviou(u.id, tipo, 40))) {
            let sucessoZap = false;
            let sucessoEmail = false;

            if (u.telefone) {
               sucessoZap = await enviarWhatsApp(u.telefone, mensagens.reativacao_30d(u.nome || "Estudante"));
               if(sucessoZap) await registrarNotificacao(u.id, tipo, 'whatsapp');
            }

            if (u.email) {
               const tmpl = emails.reativacao_30d(u.nome || "Estudante");
               sucessoEmail = await enviarEmail({ para: u.email, assunto: tmpl.assunto, html: tmpl.html });
               if(sucessoEmail) await registrarNotificacao(u.id, tipo, 'email');
            }

            if (sucessoZap || sucessoEmail) enviados++;
         }
      }
    }

    return NextResponse.json({
       processados,
       enviados,
       timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error("Cron Error:", err);
    return NextResponse.json({ error: "Internal Cron Failure" }, { status: 500 });
  }
}
