export const mensagens = {
  boas_vindas: (nome: string) =>
    `Oi ${nome}! 👋 Sua conta no Prontu tá pronta.\n\nVocê ganhou 1 trabalho grátis! Cola o enunciado aqui:\n➡️ useprontu.online\n\nQualquer dúvida é só responder aqui. 😊`,

  nao_gerou_48h: (nome: string) =>
    `Ei ${nome}! ⏰\n\nVocê tem 1 trabalho grátis no Prontu que ainda não usou.\n\nQual matéria tá precisando? A gente resolve em 3 minutos 👇\n➡️ useprontu.online`,

  gerou_sumiu_7d: (nome: string, disciplina: string) =>
    `Oi ${nome}! Como foi o trabalho de ${disciplina}? 📝\n\nTem mais provas chegando? Seus créditos ainda tão válidos.\n➡️ useprontu.online`,

  creditos_zerados: (nome: string) =>
    `${nome}, seus créditos acabaram! 🪫\n\nRecarrega agora e continua gerando. 5 trabalhos por só R$14,90 via PIX — menos de 1 minuto:\n➡️ useprontu.online/creditos`,

  reativacao_30d: (nome: string) =>
    `Fala ${nome}! Faz um tempão que você não passa por aqui. 😅\n\nProva chegando? A gente tira o trabalho em 3 minutinhos.\n➡️ useprontu.online`,

  sazonal_provas: (nome: string) =>
    `${nome}, semana de trabalhos chegando! 📚\n\nSeus créditos ainda tão válidos. Cola o enunciado e gera agora:\n➡️ useprontu.online`,
};

export const emails = {
  boas_vindas: (nome: string) => ({
    assunto: `Bem-vindo ao Prontu, ${nome}! Seu crédito grátis espera você`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px 24px">
        <div style="background:#FF4D00;color:white;padding:12px 20px;border-radius:8px;font-weight:800;font-size:20px;margin-bottom:24px;display:inline-block">
          prontu.
        </div>
        <h2 style="color:#0D0D0D;margin:0 0 12px">Oi, ${nome}! 👋</h2>
        <p style="color:#3D3935;line-height:1.6">
          Sua conta está pronta. Você tem <strong>1 trabalho grátis</strong> esperando por você.
        </p>
        <a href="https://useprontu.online" style="display:inline-block;background:#FF4D00;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0">
          Gerar meu trabalho →
        </a>
        <p style="color:#7A746E;font-size:12px;margin-top:24px">
          Prontu — Trabalho escolar pronto em minutos.
        </p>
      </div>
    `,
  }),

  reativacao_30d: (nome: string) => ({
    assunto: `${nome}, seus créditos ainda estão aqui 👀`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px 24px">
        <div style="background:#FF4D00;color:white;padding:12px 20px;border-radius:8px;font-weight:800;font-size:20px;margin-bottom:24px;display:inline-block">
          prontu.
        </div>
        <h2 style="color:#0D0D0D;margin:0 0 12px">Sentimos sua falta, ${nome}!</h2>
        <p style="color:#3D3935;line-height:1.6">
          Faz um tempão que você não gera um trabalho. Seus créditos ainda estão válidos — não deixa expirar.
        </p>
        <a href="https://useprontu.online" style="display:inline-block;background:#FF4D00;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0">
          Voltar ao Prontu →
        </a>
      </div>
    `,
  }),
};
