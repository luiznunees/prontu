"use client";

import { useState, useEffect } from "react";

interface ModalTelefoneProps {
  isOpen: boolean;
  onClose: () => void;
}

function aplicarMascaraTelefone(valor: string): string {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export default function ModalTelefone({ isOpen, onClose }: ModalTelefoneProps) {
  const [telefone, setTelefone] = useState("");
  const [serie, setSerie] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    // Prevenir scroll enquanto modal aberto
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(aplicarMascaraTelefone(e.target.value));
    setErro("");
  };

  const handleSalvar = async () => {
    const digits = telefone.replace(/\D/g, "");
    if (digits.length < 10) {
      setErro("Digite um número de WhatsApp válido com DDD.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/usuario/atualizar-perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone: digits, serie }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErro(data.error || "Erro ao salvar.");
        return;
      }

      localStorage.setItem("prontu_telefone_modal", "done");
      onClose();
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePular = () => {
    const visitas = parseInt(localStorage.getItem("prontu_tel_visitas") || "0") + 1;
    localStorage.setItem("prontu_tel_visitas", String(visitas));
    if (visitas >= 3) {
      localStorage.setItem("prontu_telefone_modal", "skipped");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handlePular}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-paper border-4 border-ink shadow-[8px_8px_0px_0px_#FF4D00] z-10 p-8">
        {/* Emoji */}
        <div className="text-5xl text-center mb-4">💬</div>

        {/* Título */}
        <h2 className="font-display font-black text-2xl text-ink uppercase text-center leading-tight mb-2">
          Qual seu WhatsApp?
        </h2>

        {/* Subtítulo */}
        <p className="text-ink/60 text-sm text-center font-medium mb-6 leading-relaxed">
          A gente avisa quando seus créditos estiverem baixos e te lembra quando tiver prova chegando.
        </p>

        {/* Inputs */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-xs font-black text-ink uppercase tracking-widest mb-1">
              WhatsApp com DDD *
            </label>
            <input
              type="tel"
              value={telefone}
              onChange={handleTelefone}
              placeholder="(11) 9 9999-9999"
              className="w-full border-2 border-ink p-3 font-bold text-ink bg-white focus:outline-none focus:border-accent placeholder:text-ink/30 transition-colors"
              autoFocus
            />
            {erro && (
              <p className="text-red-500 text-xs font-bold mt-1">{erro}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-black text-ink uppercase tracking-widest mb-1">
              Série / Ano (opcional)
            </label>
            <input
              type="text"
              value={serie}
              onChange={(e) => setSerie(e.target.value)}
              placeholder="Ex: 2° Ano EM, 3° Ano EF..."
              className="w-full border-2 border-ink p-3 font-medium text-ink bg-white focus:outline-none focus:border-accent placeholder:text-ink/30 transition-colors"
            />
          </div>
        </div>

        {/* Botão principal */}
        <button
          onClick={handleSalvar}
          disabled={loading}
          className="w-full bg-accent text-white font-display font-black uppercase py-4 border-2 border-ink shadow-[4px_4px_0px_0px_#0D0D0D] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#0D0D0D] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_#0D0D0D] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Salvando..." : "Salvar e começar →"}
        </button>

        {/* Link pular */}
        <button
          onClick={handlePular}
          className="w-full mt-3 text-xs text-ink/40 font-bold uppercase hover:text-ink/70 transition-colors"
        >
          Pular por enquanto
        </button>
      </div>
    </div>
  );
}
