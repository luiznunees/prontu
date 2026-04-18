"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AuthModal from "@/components/AuthModal";
import { createClientComponentClient } from "@/lib/supabase-client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IconDocument, IconPDF, IconAnalyzer } from "@/components/ui/Icons";

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b-4 border-ink px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-display font-black uppercase italic tracking-tighter">
            prontu<span className="text-accent">.</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="secondary" className="border-2 text-xs font-black uppercase h-10">
                  🏠 Meu Dashboard
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="text-xs font-black uppercase h-10 px-6"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>
      {/* SECTION 1: HERO */}
      <section className="relative py-12 md:py-24 px-6 overflow-hidden bg-[radial-gradient(#0d0d0d33_1px,transparent_1px)] [background-size:24px_24px]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <Badge variant="yellow" className="mb-6">✦ NOVO — IA para estudantes</Badge>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Seu trabalho<br />
              pronto.<br />
              <span className="text-accent underline decoration-ink underline-offset-4">De verdade.</span>
            </h1>
            <p className="text-lg md:text-xl font-body text-ink/80 mb-8 max-w-lg">
              Pra quando o prazo é amanhã. Cola o enunciado. Em 3 minutos, PDF na mão. A gente faz o resto.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "PDF pronto com capa personalizada",
                "Formatação ABNT automática",
                "Funciona com qualquer disciplina",
                "Imagens ilustrativas inclusas",
                "1 trabalho grátis por mês"
              ].map((item, i) => (
                <li key={i} className="flex items-center font-display font-bold text-sm md:text-base">
                  <span className="bg-prontu-green text-ink border border-ink p-1 rounded-full mr-3">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    🚀 Gerar meu trabalho
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={() => setIsAuthModalOpen(true)}
                  variant="primary" 
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Criar conta grátis
                </Button>
              )}
              <Link href="/#como-funciona">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Como funciona?
                </Button>
              </Link>
            </div>
          </div>

          <div className="animate-slide-up">
            <Card className="p-8 bg-white/90 backdrop-blur">
              <div className="text-center space-y-6">
                <div className="text-6xl">📄</div>
                <h3 className="text-2xl font-display font-bold">Gere seu trabalho em 3 passos</h3>
                <ol className="text-left space-y-4 font-body">
                  <li className="flex items-start gap-3">
                    <span className="bg-accent text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                    <span>Faça login e vá para o Dashboard</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-accent text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                    <span>Cole o enunciado do seu trabalho</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-accent text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                    <span>Baixe o PDF pronto em segundos</span>
                  </li>
                </ol>
                <p className="text-sm text-ink/60">
                  ✨ <strong>Grátis:</strong> 1 trabalho por mês para contas novas
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 2: COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-white border-y-4 border-ink px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16">Simples assim</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Cola o enunciado", desc: "Copie o tema ou as instruções fornecidas pelo professor.", icon: <IconDocument className="w-12 h-12" /> },
              { num: "02", title: "IA escreve tudo", desc: "Nossa IA gera o conteúdo, as referências, imagens e a capa exclusiva.", icon: <IconAnalyzer className="w-12 h-12" /> },
              { num: "03", title: "Baixa o PDF", desc: "Receba seu arquivo formatado e pronto para a entrega em segundos.", icon: <IconPDF className="w-12 h-12" /> }
            ].map((step, i) => (
              <Card key={i} className="text-center hover:translate-y-[-4px] transition-transform flex flex-col items-center">
                <div className="text-ink mb-4">{step.icon}</div>
                <div className="text-3xl font-display font-black text-accent mb-2 opacity-30">{step.num}</div>
                <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                <p className="font-body text-ink/70">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: COMPARATIVO */}
      <section className="py-20 px-6 bg-paper">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-12">ChatGPT faz texto.<br />A gente faz o trabalho.</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-4 border-ink border-collapse bg-white font-display">
              <thead>
                <tr className="bg-ink text-white">
                  <th className="p-4 text-left border-r-4 border-white/20">Funcionalidade</th>
                  <th className="p-4 border-r-4 border-white/20">ChatGPT</th>
                  <th className="p-4 bg-accent">Prontu</th>
                </tr>
              </thead>
              <tbody className="text-center font-bold">
                {[
                  ["Gera o texto", "✓", "✓"],
                  ["Formata ABNT", "✗", "✓"],
                  ["Capa personalizada", "✗", "✓"],
                  ["PDF pra imprimir", "✗", "✓"],
                  ["Preço", "US$ 20 / mês", "A partir de R$ 2,00"]
                ].map((row, i) => (
                  <tr key={i} className="border-b-4 border-ink">
                    <td className="p-4 text-left border-r-4 border-ink">{row[0]}</td>
                    <td className="p-4 border-r-4 border-ink text-red-500">{row[1]}</td>
                    <td className={`p-4 ${i === 4 ? "bg-accent text-white" : "bg-accent-soft"}`}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 4: PREÇO */}
      <section className="py-20 px-6 bg-white border-t-4 border-ink">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16">Simples e justo. Pague só pelo que usar.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {/* PACOTE STARTER */}
            <Card className="flex flex-col h-full bg-paper/50">
              <div className="mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">Starter</h3>
                <div className="text-4xl font-display font-black mb-4">R$ 14,90</div>
                <p className="font-body text-ink/60">Perfeito para quem precisa resolver o semestre agora.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow font-body">
                <li className="flex items-center">✓ <strong className="ml-2">5</strong> trabalhos gerados</li>
                <li className="flex items-center">✓ Capa padronizada</li>
                <li className="flex items-center text-ink/60">— <span className="ml-2">Apenas R$ 2,98 por arquivo</span></li>
              </ul>
              <Link href="/dashboard" className="w-full">
                <Button variant="secondary" className="w-full">Comprar Starter</Button>
              </Link>
            </Card>

            {/* PACOTE POPULAR */}
            <Card className="relative flex flex-col h-full border-accent border-4 shadow-[8px_8px_0px_0px_#FF4D00]">
              <Badge variant="accent" className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1">MAIS VENDIDO</Badge>
              <div className="mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">Popular</h3>
                <div className="text-4xl font-display font-black mb-4">R$ 34,90</div>
                <p className="font-body text-ink/60">Estoque garantido para todos os trabalhos do bimestre.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow font-body">
                <li className="flex items-center">✓ <strong className="ml-2">15</strong> trabalhos gerados</li>
                <li className="flex items-center">✓ Sem expiração</li>
                <li className="flex items-center text-ink/60">— <span className="ml-2">Apenas R$ 2,33 por arquivo</span></li>
              </ul>
              <Link href="/dashboard" className="w-full">
                <Button variant="primary" className="w-full">Comprar Popular</Button>
              </Link>
            </Card>

            {/* PACOTE PRO */}
            <Card className="flex flex-col h-full bg-paper/50">
              <div className="mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">Pro</h3>
                <div className="text-4xl font-display font-black mb-4">R$ 59,90</div>
                <p className="font-body text-ink/60">Divida com a galera ou tenha trabalhos o ano inteiro.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow font-body">
                <li className="flex items-center">✓ <strong className="ml-2">30</strong> trabalhos gerados</li>
                <li className="flex items-center">✓ Acesso antecipado a novidades</li>
                <li className="flex items-center text-ink/60">— <span className="ml-2">Melhor custo: R$ 2,00 por arquivo</span></li>
              </ul>
              <Link href="/dashboard" className="w-full">
                <Button variant="secondary" className="w-full">Comprar Pro</Button>
              </Link>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <p className="inline-block px-6 py-3 font-display font-bold bg-prontu-green/20 border-2 border-prontu-green text-ink rounded-lg">
              ✨ Bônus: Todo novo estudante ganha <span className="underline decoration-wavy decoration-accent">1 trabalho grátis</span> para testar!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: FOOTER */}
      <footer className="py-20 px-6 bg-ink text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <div className="text-4xl font-display font-black mb-4">prontu.</div>
            <p className="text-white/60 font-body max-w-xs">Seu trabalho pronto. De verdade. Feito para estudantes brasileiros.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center font-display font-bold uppercase text-sm">
            <Link href="/termos" className="hover:text-accent transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-accent transition-colors">Privacidade</Link>
            <a href="https://wa.me/5551989748118" className="hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">Suporte</a>
            <div className="flex items-center gap-2 text-white/40 font-body lowercase normal-case mt-4 md:mt-0">
              <span>feito com</span>
              <span className="text-accent text-xl">♥</span>
              <span>pelo time Prontu</span>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}
