const API_URL = "https://useprontu.online";

async function testePDF() {
  console.log("📄 Testando geração de PDF...\n");

  // Primeiro gera o trabalho
  const payload = {
    enunciado: "Física - Gerar trabalho sobre Lei de Ohm e circuitos elétricos simples. Incluir exemplos práticos e exercícios. Para 1ª série do Ensino Médio.",
    disciplina: "Física",
    serie: "1ª série",
    escola: "Colégio Teste",
    nomeAluno: "Maria Santos",
  };

  try {
    // 1. Gerar trabalho
    const gerarResponse = await fetch(`${API_URL}/api/gerar-trabalho`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer test-mode-123",
      },
      body: JSON.stringify(payload),
    });

    if (!gerarResponse.ok) {
      const text = await gerarResponse.text();
      throw new Error(`Erro HTTP: ${gerarResponse.status} - ${text}`);
    }

    const trabalho = await gerarResponse.json();
    console.log("✅ Trabalho gerado!");
    console.log("   Título:", trabalho.titulo);

    // 2. Gerar PDF
    const pdfPayload = {
      enunciado: "Lei de Ohm e circuitos elétricos simples. Incluir exemplos práticos e exercícios resolvidos. Para 1ª série do Ensino Médio.",
      nomeAluno: payload.nomeAluno,
      escola: payload.escola,
      disciplina: payload.disciplina,
      serie: payload.serie,
      templateId: "classico",
    };

    // Pequeno delay para evitar rate limit
    await new Promise(r => setTimeout(r, 2000));

    console.log("\n📄 Gerando PDF...");
    const pdfResponse = await fetch(`${API_URL}/api/gerar-pdf`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer test-mode-123",
      },
      body: JSON.stringify(pdfPayload),
    });

    if (!pdfResponse.ok) {
      const err = await pdfResponse.text();
      console.log("Erro detalle:", err);
      throw new Error(`Erro PDF: ${pdfResponse.status}`);
    }

    const data = await pdfResponse.json();
    const pdfBase64 = data.pdfBase64;
    
    if (!pdfBase64) {
      throw new Error("PDF não encontrado na resposta");
    }
    
    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    console.log("✅ PDF gerado!");
    console.log("   Tamanho:", (pdfBuffer.length / 1024).toFixed(1), "KB");

    // Salvar PDF para verificação
    const fs = await import("fs");
    fs.writeFileSync("teste-trabalho-fisica.pdf", pdfBuffer);
    console.log("\n💾 PDF salvo como teste-trabalho-fisica.pdf");

    return { trabalho, pdfSize: pdfBuffer.byteLength };
  } catch (error) {
    console.error("❌ Erro:", error);
    throw error;
  }
}

testePDF();