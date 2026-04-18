export default function Loading() {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 bg-[radial-gradient(#0d0d0d1a_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="relative">
        {/* Ícone de documento animado */}
        <div className="w-24 h-32 bg-white border-4 border-ink shadow-[8px_8px_0px_0px_#FF4D00] flex flex-col p-4 animate-pulse">
          <div className="w-full h-2 bg-ink/10 mb-2"></div>
          <div className="w-full h-2 bg-ink/10 mb-2"></div>
          <div className="w-2/3 h-2 bg-ink/10 mb-4"></div>
          <div className="mt-auto flex justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-display font-black text-ink uppercase italic animate-bounce">
          Carregando o Prontu...
        </h2>
        <p className="text-sm font-display font-bold text-ink/40 uppercase tracking-widest mt-2">
          Quase lá, preparando suas notas dez
        </p>
      </div>
    </div>
  );
}
