const { enviarEmail, enviarWhatsApp } = require('./src/lib/notificacoes');

(async () => {
  console.log('Enviando e-mail...');
  const emailOk = await enviarEmail({
    para: 'evertonluis.nnes@gmail.com',
    assunto: 'Teste Prontu',
    html: '<h1>Olá! Este é um teste do Prontu.</h1><p>Se você recebeu, funcionou! ✅</p>'
  });
  console.log('E-mail:', emailOk ? 'OK' : 'Erro');

  console.log('Enviando WhatsApp...');
  const whatsappOk = await enviarWhatsApp('51980985330', 'Olá! Este é um teste do Prontu. Se você recebeu, funcionou! ✅');
  console.log('WhatsApp:', whatsappOk ? 'OK' : 'Erro');
})();