import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'FAQ — Prontu',
  description: 'Perguntas frequentes sobre o Prontu',
};

const faqs = [
  {
    pergunta: 'O Prontu faz o trabalho inteiro pra mim?',
    resposta: 'O Prontu gera uma estrutura inicial baseada no tema que você informa. Você deve revisar, editar e adaptar o conteúdo. Nosso objetivo é ajudar na formatação, não substituir seu estudo.',
  },
  {
    pergunta: ' Meu professor vai saber que usei IA?',
    resposta: 'Trabalhamos para que o texto pareça natural. Mas a recomendação é sempre revisar e colocar suas próprias palavras. Isso vale para qualquer ferramenta de IA.',
  },
  {
    pergunta: 'Quanto custa?',
    resposta: 'Você pode gerar 1 trabalho grátis por mês. Para mais, temos pacotes a partir de R$ 14,90 (5 trabalhos).',
  },
  {
    pergunta: 'Posso usar em qualquer disciplina?',
    resposta: 'Sim! O Prontu funciona para qualquer matéria: Matemática, História, Biologia, Geografia, Português, Física, Química, e mais.',
  },
  {
    pergunta: 'O trabalho segue normas ABNT?',
    resposta: 'Sim! Geramos capa, folha de rosto, introdução, desenvolvimento, conclusão e referências严格按照 ABNT.',
  },
  {
    pergunta: 'Consigo editar o texto antes do PDF?',
    resposta: 'Sim, você pode editar o conteúdo gerado antes de baixar o PDF final.',
  },
  {
    pergunta: 'Quanto tempo leva para gerar?',
    resposta: 'Em média 30-60 segundos. Em horários de pico pode levar um pouco mais.',
  },
  {
    pergunta: 'O formato serve para minha escola/faculdade?',
    resposta: 'Sim, adaptamos para ensino médio, técnico e superior.',
  },
  {
    pergunta: 'Consigo baixar o PDF depois?',
    resposta: 'Sim, todos os seus trabalhos ficam salvos no histórico para novo download.',
  },
  {
    pergunta: 'Não gostee do resultado, e agora?',
    resposta: 'Você pode regenerar com instruções diferentes ou editar manualmente. Se houver erro nosso, entre em contato.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      <header className="border-b-4 border-ink px-6 py-4 bg-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-display font-black uppercase italic tracking-tighter">
            prontu<span className="text-accent">.</span>
          </Link>
          <Link href="/" className="font-display font-bold uppercase text-sm hover:text-accent transition-colors">
            Voltar ao Início
          </Link>
        </div>
      </header>

      <main className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-4">Perguntas Frequentes</h1>
          <p className="text-xl text-ink/70 mb-12">Tire suas dúvidas sobre o Prontu</p>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-white border-[1.5px] border-ink rounded-xl shadow-[4px_4px_0_#0D0D0D] overflow-hidden group"
              >
                <summary className="p-6 cursor-pointer font-display font-bold text-lg flex items-center justify-between hover:bg-ink/5 transition-colors">
                  {faq.pergunta}
                  <span className="text-2xl text-accent group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-6 pt-0 text-ink/70 leading-relaxed border-t border-ink/10 mt-2">
                  {faq.resposta}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 p-8 bg-white border-[1.5px] border-ink rounded-xl shadow-[4px_4px_0_#0D0D0D]">
            <p className="font-display font-bold text-lg mb-2">Ainda tem dúvida?</p>
            <p className="text-ink/70 mb-4">Fale conosco pelo <a href="https://wa.me/5551989748118" className="text-accent underline font-bold">WhatsApp</a>.</p>
            <Link
              href="/"
              className="inline-block bg-ink text-white px-6 py-3 font-display font-bold uppercase rounded-lg hover:bg-accent transition-colors"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}