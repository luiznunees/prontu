"use client";

import React, { useState, useEffect } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import AuthModal from "./AuthModal";
import ModalPagamento from "./ModalPagamento";

import { TEMPLATES, TemplateId } from "@/lib/templates";
import { createClientComponentClient } from "@/lib/supabase-client";
import TelaResultado from "./TelaResultado";

interface FormularioTrabalhoProps {
  onGerar?: (data: any) => void;
}

const DISCIPLINAS = [
  "Biologia", "História", "Geografia", "Português", "Matemática", 
  "Física", "Química", "Sociologia", "Filosofia", "Arte", 
  "Educação Física", "Inglês", "Outra"
];

const FormularioTrabalho = ({ onGerar }: FormularioTrabalhoProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progresso, setProgresso] = useState("");
  const [segundos, setSegundos] = useState(0);
  const [showObs, setShowObs] = useState(false);
  const [resultadoData, setResultadoData] = useState<any>(null);
  
  // Estados de Autenticação e Uso
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [creditosDisponiveis, setCreditosDisponiveis] = useState<number | null>(null);

  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    enunciado: "",
    nomeAluno: "",
    escola: "",
    disciplina: "Biologia",
    serie: "",
    turma: "",
    cidade: "",
    templateId: "classico" as TemplateId,
    observacao: "",
    incluirImagens: false,
    secoes: {
      introducao: true,
      desenvolvimento: true,
      conclusao: true,
      referencias: true,
      exercicios: false
    }
  });

  // Gerenciador de mensagens de progresso
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setSegundos((s) => s + 1);
      }, 1000);
    } else {
      setSegundos(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (segundos < 5) setProgresso("Analisando o enunciado...");
    else if (segundos < 15) setProgresso("Escrevendo o trabalho...");
    else if (segundos < 20 && formData.incluirImagens) setProgresso("Gerando imagens ilustrativas...");
    else if (segundos < 25) setProgresso("Criando a capa personalizada...");
    else setProgresso("Montando o PDF...");
  }, [segundos, formData.incluirImagens]);

  // Checar usuário logado e créditos
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: prof } = await supabase.from("users").select("creditos, trabalho_gratis_usado").eq("id", user.id).single();
        setProfile(prof);
        setCreditosDisponiveis(prof?.creditos ?? 0);
      } else {
        setCreditosDisponiveis(null);
      }
    };
    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.enunciado.length < 20) {
      setError("O enunciado deve ter pelo menos 20 caracteres.");
      return;
    }

    setError(null);

    // --- NOVA LÓGICA RIGOROSA: EXIGIR CONTA ---
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    // --- LÓGICA DE LIMITES: agora via API ---
    // O frontend não precisa mais verificar isso - a API retorna erro se não tiver crédito
    // Isso evita race conditions e mantém a lógica centralizada

    setLoading(true);

    try {
      const payload = {
        ...formData,
        // Concatena turma à série se existir para o processamento da capa
        serie: formData.turma ? `${formData.serie} — Turma ${formData.turma}` : formData.serie
      };

      const response = await fetch("/api/gerar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se for erro de sem créditos, abrir modal de pagamento
        if (data.code === "sem_creditos") {
          setIsPayModalOpen(true);
          setError(null);
          return;
        }
        throw new Error(data.error || "Falha ao gerar PDF. Tente novamente.");
      }

      // Atualizar créditos disponíveis após sucesso
      if (data.creditosRestantes !== undefined) {
        setCreditosDisponiveis(data.creditosRestantes);
      }

      setResultadoData(data);

      // Se tem callback, notificar o parent
      if (onGerar) {
        onGerar(data);
      }

    } catch (err: any) {
      setError("Ops! Algo deu errado. Tenta de novo?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Redefinir novo trabalho
  const handleNovoTrabalho = () => {
    setResultadoData(null);
    setFormData({
      ...formData,
      enunciado: "",
      observacao: ""
    });
  };

  if (resultadoData) {
    return (
      <TelaResultado 
        trabalho={resultadoData.trabalho}
        configCapa={resultadoData.configCapa}
        pdfBase64={resultadoData.pdfBase64}
        creditosRestantes={resultadoData.creditosRestantes}
        templateId={formData.templateId}
        onNovoTrabalho={handleNovoTrabalho}
      />
    );
  }

  return (
    <>
    <Card className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-display font-bold mb-1.5 text-ink uppercase text-sm">
            Enunciado ou Tema do Trabalho
          </label>
          <textarea
            className="w-full min-h-[120px] p-4 border-2 border-ink font-body focus:bg-paper focus:outline-none transition-colors"
            placeholder="Cole aqui o enunciado completo ou o tema detalhado..."
            value={formData.enunciado}
            onChange={(e) => setFormData({ ...formData, enunciado: e.target.value })}
            disabled={loading}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-display font-bold mb-1.5 text-ink uppercase text-sm">
              Nome Completo
            </label>
            <input
              type="text"
              className="w-full p-2.5 border-2 border-ink font-body focus:bg-paper focus:outline-none"
              value={formData.nomeAluno}
              onChange={(e) => setFormData({ ...formData, nomeAluno: e.target.value })}
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block font-display font-bold mb-1.5 text-ink uppercase text-sm">
              Escola
            </label>
            <input
              type="text"
              className="w-full p-2.5 border-2 border-ink font-body focus:bg-paper focus:outline-none"
              value={formData.escola}
              onChange={(e) => setFormData({ ...formData, escola: e.target.value })}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div>
            <label className="block font-display font-bold mb-1.5 text-ink uppercase text-sm">
              Disciplina
            </label>
            <select
              className="w-full p-2.5 border-2 border-ink font-body focus:bg-paper focus:outline-none bg-white"
              value={formData.disciplina}
              onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
              disabled={loading}
              required
            >
              {DISCIPLINAS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-display font-bold mb-1.5 text-ink uppercase text-sm">
              Série
            </label>
            <input
              type="text"
              placeholder="Ex: 2 Médio, 9 Fundamental..."
              className="w-full p-2.5 border-2 border-ink font-body focus:bg-paper focus:outline-none"
              value={formData.serie}
              onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
              disabled={loading}
              required
            />
            <p className="text-[10px] mt-1 text-ink/60">A gente normaliza o nome.</p>
          </div>
          <div>
            <label className="block font-display font-bold mb-1.5 text-ink uppercase text-sm">
              Turma <span className="text-[10px] normal-case opacity-60">(Opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: A, 301..."
              className="w-full p-2.5 border-2 border-ink font-body focus:bg-paper focus:outline-none"
              value={formData.turma}
              onChange={(e) => setFormData({ ...formData, turma: e.target.value })}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block font-display font-bold mb-1.5 text-ink uppercase text-sm">
            Cidade <span className="text-[10px] normal-case opacity-60">(Opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Ex: São Paulo"
            className="w-full p-2.5 border-2 border-ink font-body focus:bg-paper focus:outline-none"
            value={formData.cidade}
            onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
            disabled={loading}
          />
        </div>

        {/* Observação Colapsável */}
        <div>
          <button
            type="button"
            onClick={() => setShowObs(!showObs)}
            className="text-sm font-bold text-ink underline underline-offset-4 hover:text-prontu-accent transition-colors flex items-center gap-1"
          >
            {showObs ? "− Remover observação" : "+ Adicionar observação para a IA (ex: citar 3 autores)"}
          </button>
          
          {showObs && (
            <div className="mt-3">
              <label className="block font-display font-bold mb-1.5 text-ink uppercase text-xs">
                Observação Personalizada
              </label>
              <textarea
                className="w-full min-h-[80px] p-3 border-2 border-ink font-body text-sm focus:bg-paper focus:outline-none"
                placeholder="Ex: O professor pediu para focar no contexto histórico brasileiro..."
                value={formData.observacao}
                onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                disabled={loading}
              />
            </div>
          )}
        </div>

        {/* Toggle de Imagens */}
        <div className="p-4 bg-white border-2 border-ink rounded-lg">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🖼️</div>
              <div>
                <span className="font-display font-bold text-ink uppercase text-sm">
                  Incluir imagens ilustrativas
                </span>
                <p className="text-xs text-ink/60 font-body">
                  Adicionamos figuras relevantes ao conteúdo (gráficos, ilustrações, etc)
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.incluirImagens}
                onChange={(e) => setFormData({ ...formData, incluirImagens: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full border-2 border-ink transition-colors ${formData.incluirImagens ? 'bg-accent' : 'bg-gray-200'}`}>
                <div className={`w-5 h-5 bg-white border-2 border-ink rounded-full absolute top-0 transition-transform ${formData.incluirImagens ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </div>
            </div>
          </label>
        </div>

        {/* Opções de Seções */}
        <div className="mt-6">
          <label className="block font-display font-bold mb-3 text-ink uppercase text-sm">
            Seções do Trabalho
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "introducao", label: "📝 Introdução" },
              { key: "desenvolvimento", label: "📖 Desenvolvimento" },
              { key: "conclusao", label: "📊 Conclusão" },
              { key: "referencias", label: "📚 Referências" },
              { key: "exercicios", label: "✏️ Exercícios" },
            ].map((secao) => (
              <button
                key={secao.key}
                onClick={() => setFormData({
                  ...formData,
                  secoes: {
                    ...formData.secoes,
                    [secao.key]: !formData.secoes[secao.key as keyof typeof formData.secoes]
                  }
                })}
                className={`px-3 py-2 text-sm font-bold border-2 transition-colors ${
                  formData.secoes[secao.key as keyof typeof formData.secoes]
                    ? "border-ink bg-ink text-white"
                    : "border-ink/30 text-ink/60 hover:border-ink"
                }`}
              >
                {secao.label}
              </button>
            ))}
          </div>
        </div>

        {/* Seletor de Estilo */}
        <div>
          <label className="block font-display font-bold mb-3 text-ink uppercase text-sm">
            Estilo do Documento
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.keys(TEMPLATES) as TemplateId[]).map((id) => {
              const t = TEMPLATES[id];
              const isSelected = formData.templateId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFormData({ ...formData, templateId: id })}
                  className={`p-3 border-4 transition-all text-left relative ${
                    isSelected 
                      ? "border-prontu-accent bg-paper shadow-[0_0_0_2px_rgba(255,140,0,0.3)]" 
                      : "border-ink/20 hover:border-ink hover:bg-sand"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 text-prontu-accent text-sm">✓</span>
                  )}
                  <div 
                    className="h-24 w-full mb-2 bg-white border-2 border-ink/10 flex flex-col p-2 overflow-hidden"
                    style={{ fontFamily: t.fonte }}
                  >
                    <div 
                      className="w-3/4 h-2 mb-1" 
                      style={{ 
                        backgroundColor: `rgb(${t.corTitulo.r*255}, ${t.corTitulo.g*255}, ${t.corTitulo.b*255})`,
                        width: t.id === 'classico' ? '60%' : t.id === 'minimalista' ? '40%' : '75%'
                      }} 
                    />
                    <div 
                      className="w-full h-1 mb-0.5" 
                      style={{ backgroundColor: `rgb(${t.corTexto.r*255}, ${t.corTexto.g*255}, ${t.corTexto.b*255})`, opacity: 0.8 }} 
                    />
                    <div 
                      className="w-full h-1 mb-0.5" 
                      style={{ backgroundColor: `rgb(${t.corTexto.r*255}, ${t.corTexto.g*255}, ${t.corTexto.b*255})`, opacity: 0.6 }} 
                    />
                    <div 
                      className="w-11/12 h-1 mb-0.5" 
                      style={{ backgroundColor: `rgb(${t.corTexto.r*255}, ${t.corTexto.g*255}, ${t.corTexto.b*255})`, opacity: 0.6 }} 
                    />
                    <div 
                      className="w-full h-1" 
                      style={{ backgroundColor: `rgb(${t.corTexto.r*255}, ${t.corTexto.g*255}, ${t.corTexto.b*255})`, opacity: 0.6 }} 
                    />
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: `rgb(${t.corDestaque.r*255}, ${t.corDestaque.g*255}, ${t.corDestaque.b*255})` }} 
                    />
                    <p className="font-display font-black text-[11px] uppercase italic text-ink leading-none">{t.nome}</p>
                  </div>
                  <p className="text-[9px] text-ink/60">{t.descricao.split('•')[0]}</p>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border-2 border-red-500 text-red-600 font-bold text-sm">
            {error}
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={user && creditosDisponiveis === 0}
          >
            {loading ? progresso : "Gerar meu trabalho →"}
          </Button>
          
          <div className="mt-4 text-center flex flex-col items-center gap-2">
            {user && creditosDisponiveis !== null && (
              <p className={`text-xs font-bold ${creditosDisponiveis > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {creditosDisponiveis > 0 
                  ? `Você tem ${creditosDisponiveis} crédito${creditosDisponiveis !== 1 ? 's' : ''} disponível${creditosDisponiveis === 1 ? ' (grátis!)' : ''}`
                  : 'Sem créditos disponíveis'}
              </p>
            )}
            <p className="text-xs text-ink/60 font-body">
              Tempo estimado: 40 segundos.{' '}
            </p>
            {!user && (
              <button type="button" className="text-xs font-bold text-prontu-accent hover:underline">
                Crie uma conta grátis para salvar seu histórico
              </button>
            )}
          </div>
        </div>
      </form>
    </Card>

    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={() => setIsAuthModalOpen(false)} 
    />
    
    
    <ModalPagamento 
      isOpen={isPayModalOpen} 
      onClose={() => setIsPayModalOpen(false)} 
      planoInicial="starter"
    />
    </>
  );
};

export default FormularioTrabalho;
