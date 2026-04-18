import { generateCapaHTML, CapaConfig } from "./capa-html";
import { renderCapaToBuffer } from "./capa-render";

/**
 * Orquestra a geração da capa programática.
 * Substitui a geração por IA por um motor HTML -> PNG altamente controlado.
 */
export async function generateCapaBackground(
  titulo: string,
  disciplina: string,
  config: Omit<CapaConfig, "titulo" | "disciplina">
): Promise<Buffer | null> {
  try {
    console.log(`🎨 Renderizando capa programática para: ${disciplina}`);
    
    // 1. Gera o HTML baseado nos dados do trabalho e tema da disciplina
    const html = generateCapaHTML({
      ...config,
      titulo,
      disciplina,
    });

    // 2. Converte o HTML em um Buffer PNG usando Puppeteer
    const buffer = await renderCapaToBuffer(html);
    
    return buffer;
  } catch (error) {
    console.error("Erro crítico na renderização da capa HTML:", error);
    return null;
  }
}
