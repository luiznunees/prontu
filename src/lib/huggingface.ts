export interface HuggingFaceImage {
  url: string;
  seed: number;
}

const HF_TOKEN = process.env.HF_TOKEN || "";

export async function gerarImagem(tema: string): Promise<HuggingFaceImage | null> {
  if (!HF_TOKEN) {
    console.log("[HuggingFace] Token não configurado");
    return null;
  }

  try {
    const prompt = `Educational illustration, ${tema}, clean style, textbook quality, no text, school assignment style, white background`;

    const response = await fetch("https://router.huggingface.co/black-forest-labs/FLUX.1-schnell", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[HuggingFace] Erro na API:", response.status, errorText);
      return null;
    }

    // A resposta é uma imagem em bytes
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    
    // Converter para URL data para embedar no PDF
    const dataUrl = `data:image/png;base64,${base64}`;

    return {
      url: dataUrl,
      seed: Math.floor(Math.random() * 1000000),
    };
  } catch (error) {
    console.error("[HuggingFace] Erro ao gerar imagem:", error);
    return null;
  }
}

export async function gerarImagens(tema: string, quantidade: number = 2): Promise<string[]> {
  const resultados: string[] = [];
  
  // Gerar uma imagem por vez (mais confiável)
  for (let i = 0; i < quantidade; i++) {
    console.log(`[HuggingFace] Gerando imagem ${i + 1}/${quantidade}...`);
    const resultado = await gerarImagem(tema);
    if (resultado) {
      resultados.push(resultado.url);
    }
    // Intervalo entre requisições para evitar rate limit
    if (i < quantidade - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  return resultados;
}