const API_URL = "https://useprontu.online";

async function gerarPDFComGraficos() {
  console.log("📄 Gerando PDF com exemplos de gráficos...\n");

  const pdfPayload = {
    enunciado: `Gere um trabalho sobre Gráficos e Visualizações de Dados em Ciências.
Inclua:
1. Introdução sobre importância de gráficos
2. Desenvolvimento com exemplos de:
   - Lei de Ohm (Tensão vs Corrente) com dados: (0V, 0A), (2V, 0.4A), (4V, 0.8A), (6V, 1.2A), (8V, 1.6A), (10V, 2.0A)
   - População brasileira por região com dados: Sudeste 89M, Nordeste 57M, Sul 30M, Norte 19M, Centro-Oeste 16M
   - Crescimento bacteriano com dados: 0h=100, 2h=200, 4h=450, 6h=900, 8h=1800, 10h=3600
3. Conclusão sobre uso de gráficos`,
    nomeAluno: "Exemplo Gráficos",
    escola: "Escola Exemplo",
    disciplina: "Ciências",
    serie: "1ª série",
    templateId: "azul",
  };

  try {
    const response = await fetch(`${API_URL}/api/gerar-pdf`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer test-mode-123",
      },
      body: JSON.stringify(pdfPayload),
    });

    if (!response.ok) {
      const err = await response.text();
      console.log("Erro:", err);
      throw new Error(`Erro PDF: ${response.status}`);
    }

    const data = await response.json();
    const pdfBase64 = data.pdfBase64;
    
    if (!pdfBase64) {
      throw new Error("PDF não encontrado na resposta");
    }
    
    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    console.log("✅ PDF gerado!");
    console.log("   Tamanho:", (pdfBuffer.length / 1024).toFixed(1), "KB");

    // Salvar PDF
    const fs = await import("fs");
    fs.writeFileSync("exemplos-graficos.pdf", pdfBuffer);
    console.log("\n💾 PDF salvo como exemplos-graficos.pdf");

    return { pdfSize: pdfBuffer.length };
  } catch (error) {
    console.error("❌ Erro:", error);
    throw error;
  }
}

gerarPDFComGraficos();