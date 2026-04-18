const API_URL = "https://useprontu.online";

async function gerarTrabalhoFisica() {
  console.log("🔬 Gerando trabalho de Física...\n");

  const payload = {
    enunciado: "Física - Leis de Newton e aplicações práticas. Gere um trabalho completo com introdução, desenvolvimento e conclusão. Inclua exemplos práticos do dia a dia e exercícios resolvidos. Adequado para 1ª série do Ensino Médio.",
    disciplina: "Física",
    serie: "1ª série",
    escola: "Colegio Example",
    nomeAluno: "João Silva",
  };

  try {
    const response = await fetch(`${API_URL}/api/gerar-trabalho`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer test-mode-123",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Trabalho gerado!");
    console.log("\n--- TÍTULO ---");
    console.log(data.trabalho?.titulo || data.titulo);
    console.log("\n--- DISCIPLINA ---");
    console.log(data.trabalho?.disciplina || data.disciplina);
    console.log("\n--- ESTRUTURA COMPLETA ---");
    console.log(JSON.stringify(data, null, 2));
    console.log("\n--- REFERÊNCIAS ---");
    console.log(data.trabalho?.referencias || data.referencias);

    return data;
  } catch (error) {
    console.error("❌ Erro:", error);
    throw error;
  }
}

gerarTrabalhoFisica();