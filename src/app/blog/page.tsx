import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Prontu',
  description: 'Dicas e guias sobre trabalhos acadêmicos e ABNT',
};

const artigos = [
  {
    slug: 'como-fazer-introducao',
    titulo: 'Como fazer uma introdução perfeita',
    resumo: 'A introdução é o primeiro contato do leitor com seu trabalho. Aprenda a estruturar de forma eficiente.',
    categoria: 'Estrutura',
    data: '10/04/2026',
  },
  {
    slug: 'normas-abnt-trabalho',
    titulo: 'Guia completo de normas ABNT',
    resumo: 'Margens, espaçamento, citação... Tudo que você precisa saber sobre formatação ABNT.',
    categoria: 'Normas',
    data: '08/04/2026',
  },
  {
    slug: 'como-citar-fontes',
    titulo: 'Como citar fontes corretamente',
    resumo: 'Aprenda os diferentes tipos de citação: direta, indireta e paráfrase. Inclua referências bibliográficas.',
    categoria: 'Citação',
    data: '05/04/2026',
  },
  {
    slug: 'conclusao-trabalho',
    titulo: 'Como escrever uma conclusão impactante',
    resumo: 'A conclusão é sua última impressão. Veja como encerrar seu trabalho com chave.',
    categoria: 'Estrutura',
    data: '03/04/2026',
  },
  {
    slug: 'evitar-plagio',
    titulo: 'Como evitar plágio acidental',
    resumo: 'Dicas para citar corretamente e evitar problemas com plágio.',
    categoria: 'Dicas',
    data: '01/04/2026',
  },
];

export default function BlogPage() {
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-display font-bold mb-4">Blog</h1>
            <p className="text-xl text-ink/70">Dicas, guias e tutoriais sobre trabalhos acadêmicos</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {artigos.map((artigo) => (
              <article
                key={artigo.slug}
                className="bg-white border-[1.5px] border-ink rounded-xl shadow-[4px_4px_0_#0D0D0D] p-6 hover:shadow-[6px_6px_0_#0D0D0D] transition-shadow"
              >
                <span className="inline-block bg-ink text-white text-xs font-display font-bold uppercase px-2 py-1 rounded mb-3">
                  {artigo.categoria}
                </span>
                <h2 className="text-xl font-display font-bold mb-2">{artigo.titulo}</h2>
                <p className="text-ink/70 mb-4">{artigo.resumo}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink/50">{artigo.data}</span>
                  <span className="text-accent font-display font-bold text-sm">Ler mais →</span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 p-8 bg-ink text-white rounded-xl text-center">
            <h2 className="text-2xl font-display font-bold mb-4">Gostaria de ajuda com seu trabalho?</h2>
            <p className="mb-6 text-white/80">O Prontu gera trabalhos formatados em segundos</p>
            <Link
              href="/"
              className="inline-block bg-accent text-white px-8 py-3 font-display font-bold uppercase rounded-lg hover:bg-white hover:text-ink transition-colors"
            >
              Gerar Trabalho
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}