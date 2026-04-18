import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacidade — Prontu',
};

export default function PrivacidadePage() {
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
        <div className="max-w-3xl mx-auto bg-white border-[1.5px] border-ink rounded-xl shadow-[6px_6px_0_#0D0D0D] p-8 md:p-12">
          <h1 className="text-4xl font-display font-bold mb-8">Política de Privacidade</h1>
          
          <div className="space-y-6 text-ink/80 leading-relaxed font-body">
            <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            
            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-3 mt-8">Nossa Postura</h2>
              <p>
                No Prontu, respeitamos e protegemos seus dados pessoais de acordo com a LGPD (Lei Geral de Proteção de Dados). Não somos um app bisbilhoteiro. Retemos o essencial para garantir que o seu trabalho gerado esteja no seu painel na próxima vez que você logar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-3 mt-8">Quais dados coletamos?</h2>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Dados de Conta:</strong> Nome e E-mail (via seu provedor de Autenticação) para te darmos o acesso vitalício.</li>
                <li><strong>Dados da Geração:</strong> Título, Disciplina, Escola, e texto gerado pelas APIs de Inteligência Artificial para exibirmos e compormos a sua capa final.</li>
                <li><strong>Dados de Pagamento:</strong> Caso decida comprar os créditos extras, os mesmos são estritamente geridos, roteados e armazenados pelo Gateway Pagador Parceiro (AbacatePay) – que obedece as estritas diretrizes do Banco Central e regulatório financeiro do Pix. <strong>O Prontu não vê, não armazena e não tem acesso às suas chaves sensíveis e extratos financeiros diretos.</strong></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-3 mt-8">Privacidade com Inteligência Artificial</h2>
              <p>
                Trabalhamos com os motores mais avançados do mercado (ex: Google Gemini, OpenAI, Claude). 
                Informamos que, por vias institucionais contratuais, todos os prompts gerados em nossa conta Enterprise **não** são utilizados para treinamento de banco de dados generalizado de base. Seus trabalhos permanecem seus.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-3 mt-8">Fale com o DPO (Encarregado)</h2>
              <p>
                Deseja o apagamento em massa da sua conta, desvinculação completa dos seus trabalhos na nossa Database ou esclarecimentos pontuais? Mande-nos uma mensagem pelo <a href="https://wa.me/5551989748118" className="text-accent underline font-bold">WhatsApp</a>. Estaremos a sua disposição para a exclusão compulsória no prazo estipulado por lei.
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
