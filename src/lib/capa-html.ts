export interface CapaConfig {
  titulo: string;
  disciplina: string;
  nomeAluno: string;
  escola: string;
  serie: string;
  cidade: string;
  ano: string;
  professor?: string;
}

const temasPorDisciplina: Record<string, {
  gradiente: string,
  emoji: string,
  cor: string
}> = {
  "Biologia":        { gradiente: "linear-gradient(135deg, #1a5c2a 0%, #2d9e4f 50%, #1a5c2a 100%)", emoji: "🧬", cor: "#2d9e4f" },
  "História":        { gradiente: "linear-gradient(135deg, #5c3a1a 0%, #9e6b2d 50%, #5c3a1a 100%)", emoji: "⚔️", cor: "#9e6b2d" },
  "Geografia":       { gradiente: "linear-gradient(135deg, #1a3a5c 0%, #2d6b9e 50%, #1a3a5c 100%)", emoji: "🌍", cor: "#2d6b9e" },
  "Física":          { gradiente: "linear-gradient(135deg, #1a1a5c 0%, #3a2d9e 50%, #1a1a5c 100%)", emoji: "⚡", cor: "#3a2d9e" },
  "Química":         { gradiente: "linear-gradient(135deg, #5c1a4a 0%, #9e2d7f 50%, #5c1a4a 100%)", emoji: "⚗️", cor: "#9e2d7f" },
  "Matemática":      { gradiente: "linear-gradient(135deg, #1a1a1a 0%, #444 50%, #1a1a1a 100%)",    emoji: "📊", cor: "#888" },
  "Português":       { gradiente: "linear-gradient(135deg, #5c1a1a 0%, #9e2d2d 50%, #5c1a1a 100%)", emoji: "📖", cor: "#9e2d2d" },
  "Sociologia":      { gradiente: "linear-gradient(135deg, #3d1a5c 0%, #6b2d9e 50%, #3d1a5c 100%)", emoji: "🤝", cor: "#6b2d9e" },
  "Filosofia":       { gradiente: "linear-gradient(135deg, #1a3a3a 0%, #2d7f7f 50%, #1a3a3a 100%)", emoji: "🏛️", cor: "#2d7f7f" },
  "Arte":            { gradiente: "linear-gradient(135deg, #5c4a1a 0%, #d4881e 50%, #5c4a1a 100%)", emoji: "🎨", cor: "#d4881e" },
  "Ed. Física":      { gradiente: "linear-gradient(135deg, #5c1a1a 0%, #e03030 50%, #5c1a1a 100%)", emoji: "⚽", cor: "#e03030" },
  "Inglês":          { gradiente: "linear-gradient(135deg, #1a2e5c 0%, #1a3a8f 50%, #1a2e5c 100%)", emoji: "🌐", cor: "#1a3a8f" },
  "Outra":           { gradiente: "linear-gradient(135deg, #0D0D0D 0%, #333 50%, #0D0D0D 100%)",    emoji: "📄", cor: "#FF4D00" },
};

export function generateCapaHTML(config: CapaConfig): string {
  const tema = temasPorDisciplina[config.disciplina] || temasPorDisciplina["Outra"];
  const professor = config.professor || "Professor(a)";
  const dataCompleta = `${config.cidade}, ${config.ano}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    width: 595px;
    height: 842px;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    background: ${tema.gradiente};
    position: relative;
    color: white;
  }

  .bg-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.06;
    background-image: 
      repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 40px),
      repeating-linear-gradient(-45deg, white 0px, white 1px, transparent 1px, transparent 40px);
  }

  .circle-big {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.08);
    top: -100px;
    right: -150px;
  }

  .circle-medium {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.06);
    bottom: 50px;
    left: -80px;
  }

  .top-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 6px;
    background: #FF4D00;
  }

  .content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding: 50px 50px;
    z-index: 10;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .escola {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .aluno-info {
    font-size: 14px;
    color: rgba(255,255,255,0.95);
  }

  .professor {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    font-style: italic;
  }

  .divider {
    width: 45px;
    height: 3px;
    background: #FF4D00;
    margin-top: 20px;
  }

  .title-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 100px;
    padding: 8px 18px;
    width: fit-content;
  }

  .badge-emoji { font-size: 16px; }

  .badge-text {
    font-size: 12px;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .titulo {
    font-family: 'Syne', sans-serif;
    font-size: ${config.titulo.length > 60 ? '28px' : config.titulo.length > 40 ? '32px' : '38px'};
    font-weight: 800;
    color: white;
    line-height: 1.15;
    text-transform: uppercase;
    word-break: break-word;
  }

  .serie {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    font-weight: 500;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.15);
  }

  .prontu-badge {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #FF4D00;
  }

  .cidade-ano {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    text-align: right;
    line-height: 1.6;
    font-weight: 500;
  }
</style>
</head>
<body>
  <div class="top-bar"></div>
  <div class="bg-pattern"></div>
  <div class="circle-big"></div>
  <div class="circle-medium"></div>

  <div class="content">
    <div class="header">
      <div class="escola">${config.escola}</div>
      <div class="aluno-info">${config.nomeAluno} &bull; ${config.serie}</div>
      <div class="professor">Prof(a). ${professor}</div>
      <div class="divider"></div>
    </div>

    <div class="title-area">
      <div class="badge">
        <span class="badge-emoji">${tema.emoji}</span>
        <span class="badge-text">${config.disciplina}</span>
      </div>
      <div class="titulo">${config.titulo}</div>
    </div>

    <div class="footer">
      <div class="prontu-badge">prontu.</div>
      <div class="cidade-ano">${dataCompleta}</div>
    </div>
  </div>
</body>
</html>
  `;
}