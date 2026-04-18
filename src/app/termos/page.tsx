import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Termos de Uso — Prontu',
};

export default function TermosPage() {
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
          <h1 className="text-4xl font-display font-bold mb-8">Termos de Uso</h1>
          
          <div className="space-y-6 text-ink/80 leading-relaxed font-body">
            <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            
            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-3 mt-8">1. Escopo do Serviço</h2>
              <p>
                O Prontu é uma ferramenta baseada em Inteligência Artificial para fins de formatação e facilitação da estruturação de trabalhos escolares e acadêmicos. Nós garantimos a entrega de formatação ABNT e layout visual conforme os limites do pacote contratado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-3 mt-8">2. Responsabilidade pelo Conteúdo</h2>
              <p>
                O Prontu atua como um facilitador (&quot;copiloto&quot;) educacional. <strong>O estudante é inteiramente responsável</strong> por revisar o texto gerado, validar as fontes e adequar as informações à sua realidade acadêmica. O uso integral ou parcial do conteúdo para evitar estudo ou violar regras da instituição de ensino é de responsabilidade estrita do contratante.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-3 mt-8">3. Pagamentos e Créditos</h2>
              <p>
                As vendas ocorrem mediante compra avulsa de pacotes de crédito (Pay-as-you-go). Não há cobrança recorrente automática (Assinatura). Os créditos inseridos na conta são consumidos unitariamente a cada clique em &quot;Gerar PDF&quot; e não são passíveis de reembolso parcial caso existam saldos na conta do usuário, dada a natureza de fornecimento integral de inteligência computacional.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-display font-bold text-ink mb-3 mt-8">4. Garantia e Disponibilidade</h2>
              <p>
                Embora utilizemos alta disponibilidade fornecida por Vercel e APIs Cloud de LLMs confiáveis, a plataforma não garante 100% de precisão gramatical ou estrutural sem necessidade de revisão. Encaramos nossos SLAs como *best-effort*.
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
