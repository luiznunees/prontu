"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import ModalPagamento from "./ModalPagamento";
import { detectarGrafico } from "@/lib/graficos-templates";

interface TelaResultadoProps {
  trabalho: any; // O objeto JSON detalhado (titulo, secoes, etc)
  configCapa: any;
  pdfBase64: string; 
  creditosRestantes: number;
  templateId: string;
  onNovoTrabalho: () => void;
}

export default function TelaResultado({ 
  trabalho, 
  configCapa, 
  pdfBase64, 
  creditosRestantes, 
  templateId,
  onNovoTrabalho 
}: TelaResultadoProps) {
  
  const [analiseLoading, setAnaliseLoading] = useState(false);
  const [analiseResult, setAnaliseResult] = useState<any>(null);

  const [humanizarNivel, setHumanizarNivel] = useState<"leve" | "medio" | "forte">("medio");
  const [humanizarLoading, setHumanizarLoading] = useState(false);
  const [textoHumanizadoOutput, setTextoHumanizadoOutput] = useState<any>(null);
  const [pdfHumanizadoLoading, setPdfHumanizadoLoading] = useState(false);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  // Detectar gráfico baseado no trabalho
  const trabalhoTexto = trabalho?.titulo + " " + trabalho?.secoes?.map((s: any) => s.conteudo).join(" ");
  const graficoDetectado = detectarGrafico(trabalho?.titulo || "", trabalhoTexto, trabalho?.disciplina);

  useEffect(() => {
    if (!chartRef.current || !graficoDetectado) return;

    // Destruir gráfico anterior
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Import dinâmico do Chart.js
    import("chart.js/auto").then(({ default: Chart }) => {
      const ctx = chartRef.current?.getContext("2d");
      if (!ctx) return;

      chartInstanceRef.current = new Chart(ctx, {
        type: graficoDetectado.tipo,
        data: {
          labels: graficoDetectado.labels,
          datasets: [{
            label: graficoDetectado.titulo,
            data: graficoDetectado.values,
            backgroundColor: graficoDetectado.cores || ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c"],
            borderColor: "#34495e",
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: graficoDetectado.tipo === "pie" || graficoDetectado.tipo === "doughnut" },
            title: { display: true, text: graficoDetectado.titulo, font: { size: 16, weight: "bold" as const } },
          },
          scales: graficoDetectado.tipo !== "pie" && graficoDetectado.tipo !== "doughnut" ? {
            x: { title: { display: true, text: graficoDetectado.eixoX } },
            y: { title: { display: true, text: graficoDetectado.eixoY }, beginAtZero: true },
          } : undefined,
        },
      });
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [graficoDetectado]);

  // Exibir Confetes (CSS baseado em um fade-out após 3 seg)
  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleDownloadOriginal = () => {
    // Converter de base64 para blob
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'application/pdf'});

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trabalho-${trabalho.disciplina?.toLowerCase() || 'prontu'}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getTextoConcatenado = () => {
    return trabalho.secoes.map((s: any) => s.conteudo).join("\n\n");
  };

  const handleAnalisar = async () => {
    setAnaliseLoading(true);
    try {
      const resp = await fetch("/api/analisar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: getTextoConcatenado() })
      });
      const data = await resp.json();
      if(data.error) throw new Error(data.error);
      setAnaliseResult(data);
    } catch(err) {
      alert("Erro ao analisar texto.");
    } finally {
      setAnaliseLoading(false);
    }
  };

  const handleHumanizar = async () => {
    setHumanizarLoading(true);
    setTextoHumanizadoOutput(null);
    try {
      const resp = await fetch("/api/humanizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: getTextoConcatenado(), nivel: humanizarNivel })
      });
      const data = await resp.json();
      if(data.error) throw new Error(data.error);
      setTextoHumanizadoOutput(data);
    } catch(err) {
      alert("Erro ao humanizar texto.");
    } finally {
      setHumanizarLoading(false);
    }
  };

  const handleBaixarPdfHumanizado = async () => {
    if (!textoHumanizadoOutput?.textoHumanizado) return;
    
    setPdfHumanizadoLoading(true);
    try {
      const resp = await fetch("/api/gerar-pdf-humanizado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trabalhoOriginal: trabalho,
          textoHumanizado: textoHumanizadoOutput.textoHumanizado,
          config: {
            nomeAluno: configCapa.nomeAluno,
            escola: configCapa.escola,
            disciplina: trabalho.disciplina,
            serie: configCapa.serie,
            cidade: configCapa.cidade,
            templateId: templateId
          }
        })
      });

      if (!resp.ok) throw new Error("Erro ao gerar PDF");

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trabalho-humanizado-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err: any) {
      alert("Ops, erro ao montar o PDF humanizado.");
    } finally {
      setPdfHumanizadoLoading(false);
    }
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto overflow-hidden relative">
        {/* Pseudo-Confetes Effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex justify-center opacity-80 transition-opacity duration-1000">
            {Array.from({length: 40}).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-3 h-3 bg-accent animate-spin"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                  backgroundColor: ['#FF4D00', '#FFCD00', '#00A63E', '#202020'][Math.floor(Math.random() * 4)],
                  animation: `fall ${1 + Math.random() * 2}s linear forwards`,
                }}
              />
            ))}
            <style jsx>{`
              @keyframes fall {
                to { transform: translateY(100vh) rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        <div className="p-8 pb-4 text-center">
          <div className="w-20 h-20 bg-green-500 border-4 border-ink shadow-[4px_4px_0px_0px_#000] rounded-full flex justify-center items-center mx-auto mb-4 animate-in zoom-in duration-500">
            <span className="text-white text-5xl">✓</span>
          </div>
          <h2 className="text-3xl font-display font-black text-ink uppercase mb-2">Trabalho pronto!</h2>
          <p className="text-ink/60 font-bold max-w-sm mx-auto line-clamp-2">{trabalho?.titulo}</p>

          {graficoDetectado && (
            <div className="mt-6 p-4 bg-white border-4 border-ink shadow-[4px_4px_0px_0px_#000]">
              <h3 className="text-sm font-black uppercase mb-2">📊 Visualização</h3>
              <div className="h-[280px]">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 pb-8 flex justify-center">
          <Button onClick={handleDownloadOriginal} className="w-full md:w-2/3 py-4 text-lg">
            ⬇ Baixar PDF
          </Button>
        </div>

        <div className="px-8">
          <div className="h-[2px] bg-ink/10 relative my-6">
            <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-3 text-xs font-black uppercase text-ink/40 tracking-widest">
              Ferramentas Gratuitas
            </span>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Card: Analisador */}
          <div className="border-4 border-ink p-5 bg-sand/30 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-display font-black text-ink uppercase flex items-center gap-2">
                  <span>🔍</span> Analisar Originalidade
                </h3>
                <p className="text-xs text-ink/60 font-bold mt-1">Veja quanto o seu texto parece escrito por um humano ou por IA.</p>
              </div>
              {!analiseResult && !analiseLoading && (
                <Button variant="secondary" size="sm" onClick={handleAnalisar} className="whitespace-nowrap">
                  Analisar agora
                </Button>
              )}
            </div>

            {analiseLoading && (
              <div className="text-xs font-bold text-ink/40 uppercase mt-4 animate-pulse">
                Analisando textos...
              </div>
            )}

            {analiseResult && (
              <div className="mt-5 animate-in slide-in-from-top-2">
                <div className="flex justify-between text-xs font-black uppercase mb-1">
                  <span className="text-green-600">{analiseResult.scoreHumano}% Humano</span>
                  <span className="text-accent">{analiseResult.scoreIA}% IA</span>
                </div>
                <div className="w-full h-3 bg-ink/10 flex overflow-hidden mb-4">
                  <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${analiseResult.scoreHumano}%`}}></div>
                  <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${analiseResult.scoreIA}%`}}></div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm font-medium">
                  <div>
                    <strong className="text-green-600 block mb-1 uppercase text-[10px] font-black">✓ Pontos Fortes</strong>
                    <ul className="list-disc pl-4 text-ink/70 space-y-1 text-xs">
                      {analiseResult.pontos_fortes?.map((p: string, i: number) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-accent block mb-1 uppercase text-[10px] font-black">⚠ Pontos de Atenção</strong>
                    <ul className="list-disc pl-4 text-ink/70 space-y-1 text-xs">
                      {analiseResult.pontos_fracos?.map((p: string, i: number) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 border-2 border-blue-200 p-3 text-xs text-blue-900">
                  <strong className="uppercase font-black block mb-1">💡 Sugestão:</strong>
                  {analiseResult.sugestao}
                </div>
              </div>
            )}
          </div>

          {/* Card: Humanizador */}
          <div className="border-4 border-ink p-5 bg-sand/30 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            <h3 className="text-lg font-display font-black text-ink uppercase flex items-center gap-2 mb-1">
              <span>✍️</span> Humanizar Texto
            </h3>
            <p className="text-xs text-ink/60 font-bold mb-4">Reescreva para soar mais natural caso o professor suspeite de IA.</p>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {([
                { id: "leve", label: "Leve" },
                { id: "medio", label: "Médio ★" },
                { id: "forte", label: "Forte" }
              ] as const).map(n => (
                <button
                  key={n.id}
                  onClick={() => setHumanizarNivel(n.id)}
                  className={`
                    border-2 px-3 py-1.5 text-xs font-black uppercase transition-all whitespace-nowrap
                    ${humanizarNivel === n.id 
                        ? "border-ink bg-ink text-white" 
                        : "border-ink/20 text-ink/60 hover:border-ink"
                    }
                  `}
                >
                  {n.label}
                </button>
              ))}
            </div>

            <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleHumanizar} 
                loading={humanizarLoading} 
                className="w-full mb-4 border-dashed"
            >
              {humanizarLoading ? "Reescrevendo..." : "🛠 Reescrever Texto"}
            </Button>

            {textoHumanizadoOutput && (
              <div className="mt-4 animate-in slide-in-from-top-2 space-y-3">
                <span className="inline-block bg-accent/10 border-2 border-accent text-accent px-2 py-1 text-[10px] uppercase font-black">
                  TEXTO HUMANIZADO — {textoHumanizadoOutput.caracteresNovos} CARACTERES
                </span>
                
                <div className="max-h-[200px] overflow-y-auto p-3 text-xs font-medium text-ink bg-white border-2 border-ink">
                  {textoHumanizadoOutput.textoHumanizado.split('\n\n').map((p: string, i: number) => (
                    <p key={i} className="mb-2 last:mb-0">{p}</p>
                  ))}
                </div>

                <Button 
                  onClick={handleBaixarPdfHumanizado} 
                  loading={pdfHumanizadoLoading}
                  className="w-full mt-2"
                >
                  Baixar PDF Humanizado
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-ink p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white mt-4 relative">
          <div className="text-sm font-bold opacity-80 uppercase tracking-widest text-center md:text-left">
            Você tem {creditosRestantes} créditos
            {creditosRestantes <= 1 && (
               <button onClick={() => setIsPayModalOpen(true)} className="ml-3 text-accent underline underline-offset-4 hover:text-white">
                 Comprar M<span>ais</span>
               </button>
            )}
          </div>
          <button 
            onClick={onNovoTrabalho}
            className="text-xs uppercase font-black bg-white/10 hover:bg-white/20 px-4 py-2 border-2 border-transparent transition-colors"
          >
            Gerar Outro Trabalho
          </button>
        </div>
      </Card>
      
      <ModalPagamento 
        isOpen={isPayModalOpen} 
        onClose={() => setIsPayModalOpen(false)} 
        planoInicial="popular"
      />
    </>
  );
}
