"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ModalTelefone from "@/components/ModalTelefone";
import ModalPagamento from "@/components/ModalPagamento";
import FormularioTrabalho from "@/components/FormularioTrabalho";
import TelaResultado from "@/components/TelaResultado";
import { createClientComponentClient } from "@/lib/supabase-client";

interface Trabalho {
  id: string;
  titulo: string;
  disciplina: string;
  criado_em: string;
  pdf_url: string;
  status?: string;
  erroMensagem?: string;
}

interface Profile {
  nome: string;
  creditos: number;
  telefone_coletado: boolean;
}

interface DashboardClientProps {
  profile: Profile;
  trabalhos: Trabalho[];
  primeiroNome: string;
}

export default function DashboardClient({ profile, trabalhos: trabalhosIniciais, primeiroNome }: DashboardClientProps) {
  const [showModalTelefone, setShowModalTelefone] = useState(false);
  const [showModalPagamento, setShowModalPagamento] = useState(false);
  const [showFormulario, setShowFormulario] = useState(false);
  const [resultadoData, setResultadoData] = useState<any>(null);
  const [trabalhos, setTrabalhos] = useState(trabalhosIniciais);
  const [notificacao, setNotificacao] = useState<string | null>(null);
  
  const creditos = profile?.creditos ?? 0;
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [showMenu, setShowMenu] = useState(false);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu')) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMenu]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    setTrabalhos(trabalhosIniciais);
  }, [trabalhosIniciais]);

  useEffect(() => {
    // Mostrar ModalTelefone se não coletou telefone ainda
    if (!profile?.telefone_coletado) {
      const modalStatus = localStorage.getItem("prontu_telefone_modal");
      const visitas = parseInt(localStorage.getItem("prontu_tel_visitas") || "0");
      if (modalStatus !== "done" && modalStatus !== "skipped" || visitas < 3) {
        if (modalStatus !== "done") {
          setShowModalTelefone(true);
        }
      }
    }
  }, [profile?.telefone_coletado]);

  // Polling para verificar trabalhos pendentes
  useEffect(() => {
    const hasPending = trabalhos.some(t => t.status === "pendente" || t.status === "processando");
    if (!hasPending) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/trabalhos?status=pendente");
        const data = await res.json();
        
        if (data.trabalhos) {
          const aindaTemPendente = data.trabalhos.some((t: Trabalho) => t.status === "pendente" || t.status === "processando");
          
          if (!aindaTemPendente) {
            const trabalhosConcluidos = data.trabalhos.filter((t: Trabalho) => t.status === "concluido");
            if (trabalhosConcluidos.length > 0) {
              setNotificacao("Seu trabalho está pronto! Baixe agora.");
              setTrabalhos(data.trabalhos);
            }
          } else {
            setTrabalhos(data.trabalhos);
          }
        }
      } catch (e) {
        console.error("Erro ao atualizar trabalhos:", e);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [trabalhos]);

  // Função para fechar resultado e voltar ao dashboard
  const handleVoltarDashboard = () => {
    setResultadoData(null);
    setShowFormulario(false);
  };

  // Se há resultado, mostrar a tela de resultado
  if (resultadoData) {
    return (
      <TelaResultado 
        trabalho={resultadoData.trabalho}
        configCapa={resultadoData.configCapa}
        pdfBase64={resultadoData.pdfBase64}
        creditosRestantes={resultadoData.creditosRestantes}
        templateId={resultadoData.templateId}
        onNovoTrabalho={handleVoltarDashboard}
      />
    );
  }

  // Se mostrar formulário, renderizar como modal
  if (showFormulario) {
    return (
      <>
        {/* Dashboard em blur ao fundo */}
        <div className="min-h-screen bg-sand p-4 md:p-8 blur-sm pointer-events-none">
          <div className="max-w-5xl mx-auto opacity-50">
            <div className="h-20" />
            {/* Mini preview do dashboard */}
          </div>
        </div>
        
        {/* Modal do formulário */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFormulario(false)}
          />
          <div className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white border-4 border-ink shadow-[12px_12px_0px_0px_#000]">
            <button 
              onClick={() => setShowFormulario(false)}
              className="absolute top-4 right-4 text-2xl text-ink/40 hover:text-ink z-10"
            >
              ✕
            </button>
            <FormularioTrabalho 
              onGerar={(data) => {
                setResultadoData(data);
                setShowFormulario(false);
              }}
            />
          </div>
        </div>
      </>
    );
  }

  // Estado do card de créditos
  const creditoCardConfig = creditos === 0
    ? {
        bg: "bg-red-50 border-red-400",
        texto: "Seus créditos acabaram",
        sub: "Compre mais para gerar novos trabalhos",
        emoji: "😬",
        btnTexto: "Comprar créditos →",
        btnSize: "default" as const,
      }
    : creditos === 1
    ? {
        bg: "bg-yellow-50 border-yellow-400",
        texto: "Último crédito!",
        sub: "Use com sabedoria. Compre mais para garantir.",
        emoji: "⚡",
        btnTexto: "Comprar mais",
        btnSize: "sm" as const,
      }
    : {
        bg: "bg-green-50 border-green-400",
        texto: `${creditos} créditos disponíveis`,
        sub: "Cada crédito = 1 trabalho gerado.",
        emoji: "✅",
        btnTexto: "Comprar mais",
        btnSize: "sm" as const,
      };

  return (
    <>
      <div className="min-h-screen bg-sand p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-display font-black text-ink uppercase italic leading-none">
                Olá, {primeiroNome}!
              </h1>
              <p className="text-ink/60 font-medium">Bem-vindo ao seu painel Prontu.</p>
            </div>
            <div className="flex gap-3 items-center">
              {/* Menu do usuário */}
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="h-10 px-3 border-2 border-ink rounded-lg bg-white flex items-center gap-2 font-bold text-sm hover:bg-sand"
                >
                  <span className="text-lg">👤</span>
                </button>
                
                {showMenu && (
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                )}
                
                {showMenu && (
                  <div className="fixed right-0 top-0 h-full w-72 bg-white border-l-4 border-ink shadow-[-8px_0px_0px_#000] z-50 overflow-y-auto">
                    <div className="p-4 border-b-4 border-ink">
                      <p className="font-bold text-lg">{primeiroNome}</p>
                      <button onClick={() => setShowMenu(false)} className="text-xl absolute top-2 right-3">✕</button>
                    </div>
                    <a href="mailto:oi@useprontu.online" onClick={() => setShowMenu(false)} className="block px-4 py-4 text-left font-bold text-sm hover:bg-sand border-b border-ink/10">
                      📧 Alterar e-mail
                    </a>
                    <a href="/privacidade" onClick={() => setShowMenu(false)} className="block px-4 py-4 text-left font-bold text-sm hover:bg-sand border-b border-ink/10 text-red-600">
                      🗑️ Excluir conta
                    </a>
                    <button 
                      onClick={() => { setShowMenu(false); handleSignOut(); }}
                      className="w-full px-4 py-4 text-left font-bold text-sm hover:bg-sand text-orange-600"
                    >
                      🚪 Sair
                    </button>
                  </div>
                )}
              </div>
              <Button 
                variant="primary" 
                onClick={() => setShowFormulario(true)}
                className="border-2 font-bold"
              >
                + Novo Trabalho
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card de Créditos */}
            <Card className={`p-6 border-4 border-ink shadow-[8px_8px_0px_0px_#000] ${creditoCardConfig.bg}`}>
              <h3 className="text-xs font-black text-ink/40 uppercase tracking-widest mb-4">
                Seus Créditos
              </h3>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">{creditoCardConfig.emoji}</span>
                  <span className="text-2xl font-black text-ink uppercase leading-none">
                    {creditos === 0 ? "Sem créditos" : `${creditos} crédito${creditos !== 1 ? "s" : ""}`}
                  </span>
                </div>
                <p className="text-ink/60 text-sm font-medium">{creditoCardConfig.sub}</p>
              </div>

              <button
                onClick={() => setShowModalPagamento(true)}
                className={`
                  w-full bg-accent text-white font-display font-black uppercase border-2 border-ink
                  shadow-[4px_4px_0px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px]
                  hover:shadow-[6px_6px_0px_0px_#0D0D0D] active:translate-x-0 active:translate-y-0
                  active:shadow-[2px_2px_0px_0px_#0D0D0D] transition-all
                  ${creditoCardConfig.btnSize === "default" ? "py-3 text-sm" : "py-2 text-xs"}
                `}
              >
                {creditoCardConfig.btnTexto}
              </button>
            </Card>

            {/* Histórico de Trabalhos */}
            <div className="md:col-span-2 space-y-4">
              {notificacao && (
                <div className="bg-green-500 text-white font-bold p-4 border-2 border-ink shadow-[4px_4px_0px_0px_#000] animate-pulse">
                  {notificacao}
                </div>
              )}
              <h3 className="text-xs font-black text-ink/40 uppercase tracking-widest px-2">
                Histórico de Trabalhos
              </h3>

              {trabalhos && trabalhos.length > 0 ? (
                trabalhos.map((t) => {
                  const status = t.status || "concluido";
                  const isPendente = status === "pendente";
                  const isProcessando = status === "processando";
                  const pronto = status === "concluido";
                  
                  return (
                    <Card key={t.id} className={`p-4 bg-white flex justify-between items-center group hover:bg-sand transition-colors ${isProcessando ? "bg-yellow-50 border-yellow-400" : ""}`}>
                      <div>
                        <h4 className="font-bold text-ink uppercase truncate max-w-[200px] md:max-w-md">
                          {t.titulo}
                        </h4>
                        <div className="flex gap-2 text-[10px] font-bold text-ink/40 uppercase">
                          <span>{t.disciplina}</span>
                          <span>•</span>
                          <span>{new Date(t.criado_em).toLocaleDateString("pt-BR")}</span>
                          {isPendente && <span className="text-orange-500">• Gerando...</span>}
                          {isProcessando && <span className="text-yellow-600 animate-pulse">• Quase listo...</span>}
                        </div>
                      </div>
                      {pronto && (
                        <a href={t.pdf_url} download target="_blank">
                          <Button variant="secondary" className="border-2 text-[10px] h-8 px-3">
                            Baixar PDF
                          </Button>
                        </a>
                      )}
                      {isPendente && (
                        <span className="text-orange-500 font-bold text-xs animate-pulse">
                          Na fila
                        </span>
                      )}
                      {isProcessando && (
                        <span className="text-yellow-600 font-bold text-xs animate-pulse">
                          Gerando
                        </span>
                      )}
                    </Card>
                  );
                })
              ) : (
                <Card className="p-10 text-center bg-white/50 border-dashed border-2 border-ink/20">
                  <p className="text-ink/40 font-bold uppercase text-sm">
                    Nenhum trabalho gerado ainda.
                  </p>
                  <button onClick={() => setShowFormulario(true)} className="inline-block mt-4">
                    <Button variant="primary" size="sm">Gerar meu primeiro trabalho →</Button>
                  </button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      <ModalTelefone
        isOpen={showModalTelefone}
        onClose={() => setShowModalTelefone(false)}
      />
      <ModalPagamento
        isOpen={showModalPagamento}
        onClose={() => setShowModalPagamento(false)}
        planoInicial="starter"
      />
    </>
  );
}
