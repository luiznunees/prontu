import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-center">
      <div className="animate-bounce text-8xl mb-8">📄💨</div>
      
      <div className="max-w-md">
        <h1 className="text-4xl font-display font-black text-ink mb-4 italic uppercase">
          Eita! Página não encontrada...
        </h1>
        <p className="text-lg font-body text-ink/60 mb-10">
          Parece que essa página fugiu da escola. 
          Essa página não existe... mas seu trabalho pode!
        </p>
        
        <Link href="/">
          <Button className="w-full py-4 text-xl shadow-[6px_6px_0px_0px_#000]">
            Voltar para a Home →
          </Button>
        </Link>
      </div>

      <div className="mt-12 opacity-20 text-xs font-display font-bold uppercase tracking-widest">
        Erro 404 • Prontu
      </div>
    </div>
  );
}
