"use client";

import React, { useState, useEffect } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";

interface ModalPagamentoProps {
  isOpen: boolean;
  onClose: () => void;
  planoInicial: "starter" | "popular" | "pro";
}

type Step = "selection" | "form" | "qrcode" | "pago" | "expirado";
type PacoteKey = "starter" | "popular" | "pro";

const PACOTES = {
  starter: { id: "starter", creditos: 5,  valor: 1490, nome: "Starter — 5 créditos",  valorFormatado: "R$ 14,90", porCredito: "R$2,98/trabalho" },
  popular: { id: "popular", creditos: 15, valor: 3490, nome: "Popular — 15 créditos", valorFormatado: "R$ 34,90", porCredito: "R$2,33/trabalho" },
  pro:     { id: "pro",     creditos: 30, valor: 5990, nome: "Pro — 30 créditos",     valorFormatado: "R$ 59,90", porCredito: "R$2,00/trabalho" },
};

const ModalPagamento = ({ isOpen, onClose, planoInicial }: ModalPagamentoProps) => {
  const [step, setStep] = useState<Step>("selection");
  const [loading, setLoading] = useState(false);
  const [pacote, setPacote] = useState<PacoteKey>(planoInicial || "starter");
  const [pixData, setPixData] = useState<any>(null);
  const [creditosAdicionados, setCreditosAdicionados] = useState(0);
  const [totalCreditos, setTotalCreditos] = useState(0);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    celular: "",
    cpf: ""
  });
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);

  // Resetar ao abrir
  useEffect(() => {
    if (isOpen) {
      setStep("selection");
      setPacote(planoInicial || "starter");
    }
  }, [isOpen, planoInicial]);

  // Polling para checar pagamento
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (step === "qrcode" && pixData?.pixId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/pagamento/checar-pix?pixId=${pixData.pixId}`);
          const data = await res.json();
          if (data.status === "PAID") {
            setCreditosAdicionados(data.creditos_adicionados || 0);
            setTotalCreditos(data.total_creditos || 0);
            setStep("pago");
            clearInterval(interval);
          } else if (data.status === "EXPIRED") {
            setStep("expirado");
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Erro no polling:", err);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [step, pixData]);

  // Timer regressivo
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "qrcode" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleGerarPix = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/pagamento/criar-pix", {
        method: "POST",
        body: JSON.stringify({
          pacote: pacote,
          nomeAluno: formData.nome,
          email: formData.email,
          celular: formData.celular,
          cpf: formData.cpf
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPixData(data);
      setStep("qrcode");
      setTimeLeft(3600);
    } catch (err: any) {
      alert(err.message || "Erro ao gerar PIX");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixData.copiaCola);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="max-w-2xl w-full relative overflow-hidden bg-white max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-ink/40 hover:text-ink transition-colors z-10"
        >
          ✕
        </button>

        {step === "selection" && (
          <div className="p-6">
            <h2 className="text-2xl font-display font-black text-ink mb-2 uppercase text-center">
              Turbine seus trabalhos
            </h2>
            <p className="text-ink/60 text-sm mb-6 text-center">
              Selecione um pacote de créditos. Cada trabalho gerado consome 1 crédito. Sem mensalidades!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.values(PACOTES).map((p) => {
                const isSelected = pacote === p.id;
                const isPopular = p.id === "popular";
                return (
                  <div 
                    key={p.id}
                    onClick={() => setPacote(p.id as PacoteKey)}
                    className={`
                      relative p-4 cursor-pointer transition-all border-4 rounded-xl
                      ${isSelected ? "border-accent bg-accent/5" : "border-ink/10 hover:border-ink/30"}
                    `}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-black px-2 py-1 uppercase rounded-full whitespace-nowrap">
                        ★ Mais Popular
                      </div>
                    )}
                    <h3 className="font-display font-black text-lg uppercase text-ink">{p.id}</h3>
                    <div className="text-sm font-bold text-ink/60 mb-2">{p.creditos} créditos</div>
                    <div className="text-2xl font-black text-ink mb-1">{p.valorFormatado}</div>
                    <div className="text-[10px] font-bold text-ink/40 uppercase">{p.porCredito}</div>
                  </div>
                );
              })}
            </div>

            <Button 
              className="w-full py-4 text-lg"
              onClick={() => setStep("form")}
            >
              Continuar com {PACOTES[pacote].id} →
            </Button>
          </div>
        )}

        {step === "form" && (
          <div className="p-6">
            <h2 className="text-2xl font-display font-black text-ink mb-2 uppercase">
              Dados para Pagamento
            </h2>
            <p className="text-ink/60 text-sm mb-6">
              Preencha os dados abaixo para gerar o QR Code PIX do pacote <span className="font-bold text-ink uppercase">{PACOTES[pacote].id}</span>.
            </p>

            <form onSubmit={handleGerarPix} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink uppercase mb-1">Nome Completo</label>
                <input 
                  required
                  className="w-full border-2 border-ink p-2 font-medium focus:bg-accent/5 outline-none transition-colors"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Seu nome"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase mb-1">Email</label>
                  <input 
                    required
                    type="email"
                    className="w-full border-2 border-ink p-2 font-medium focus:bg-accent/5 outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase mb-1">CPF</label>
                  <input 
                    required
                    className="w-full border-2 border-ink p-2 font-medium focus:bg-accent/5 outline-none"
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-ink uppercase mb-1">WhatsApp / Celular</label>
                <input 
                  required
                  className="w-full border-2 border-ink p-2 font-medium focus:bg-accent/5 outline-none"
                  value={formData.celular}
                  onChange={(e) => setFormData({...formData, celular: e.target.value})}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="bg-accent/10 p-3 border-2 border-accent/20 flex justify-between items-center mt-2">
                <span className="font-bold text-ink uppercase text-sm">Total:</span>
                <span className="text-xl font-black text-accent">
                  {PACOTES[pacote].valorFormatado}
                </span>
              </div>

              <div className="flex gap-4">
                <Button 
                  type="button"
                  variant="ghost"
                  className="w-1/3 py-4 text-sm px-0"
                  onClick={() => setStep("selection")}
                >
                  ← Voltar
                </Button>
                <Button 
                  type="submit" 
                  className="w-2/3 py-4 text-lg"
                  loading={loading}
                >
                  Gerar QR Code
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === "qrcode" && (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-display font-black text-ink mb-1 uppercase">
              Escaneie para Pagar
            </h2>
            <div className="inline-block bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 border border-green-700 mb-4 uppercase">
              PIX • Aprovação Instantânea
            </div>

            <div className="mb-6 flex justify-center">
              <div className="p-2 border-4 border-ink shadow-[4px_4px_0px_0px_#000]">
                <img 
                  src={pixData?.qrCodeBase64} 
                  alt="QR Code PIX" 
                  width={220} 
                  height={220} 
                />
              </div>
            </div>

            <div className="text-3xl font-black text-ink mb-4">
              R$ {(pixData?.valor / 100).toFixed(2).replace(".", ",")}
            </div>

            <Button 
              onClick={copyToClipboard}
              variant="secondary"
              className="w-full mb-6 border-2"
            >
              {copied ? "✓ Copiado!" : "Copiar Código PIX"}
            </Button>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-ink/60 text-sm font-bold uppercase">
                <div className="w-3 h-3 border-2 border-ink border-t-transparent animate-spin rounded-full"></div>
                Aguardando Pagamento...
              </div>
              <div className="text-ink/40 text-[10px] font-bold uppercase">
                Expira em: <span className="text-ink">{formatTime(timeLeft)}</span>
              </div>
            </div>
            
            <p className="mt-6 text-[11px] text-ink/40 leading-tight">
              Seus créditos serão liberados automaticamente após o pagamento. 
              Não feche esta tela se possível.
            </p>
          </div>
        )}

        {step === "pago" && (
          <div className="p-10 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-500 border-4 border-ink rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_#000]">
              <span className="text-4xl text-white">✓</span>
            </div>
            <h2 className="text-3xl font-display font-black text-ink mb-2 uppercase italic leading-tight">
              {creditosAdicionados} créditos adicionados!
            </h2>
            <p className="text-ink/60 mb-8 font-medium">
              Pagamento confirmado. Você agora tem <span className="font-black text-ink">{totalCreditos} créditos</span> no total para usar quando quiser!
            </p>
            <Button 
              className="w-full py-4 text-xl"
              onClick={() => window.location.reload()}
            >
              Começar Agora →
            </Button>
          </div>
        )}

        {step === "expirado" && (
          <div className="p-10 text-center">
            <div className="text-6xl mb-4 text-ink/20">⏰</div>
            <h2 className="text-2xl font-display font-black text-ink mb-2 uppercase">
              QR Code Expirado
            </h2>
            <p className="text-ink/60 mb-8 font-medium">
              O tempo para realizar o pagamento encerrou.
            </p>
            <Button 
              className="w-full"
              onClick={() => setStep("selection")}
            >
              Tentar Novamente
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ModalPagamento;
