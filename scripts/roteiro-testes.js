/**
 * 📋 ROTEIRO DE TESTE - PRONTU
 * Execute cada item manualmente ou via Postman/Insomnia
 */

const TESTES = [
  {
    id: 1,
    nome: "Física - Movimentos",
    payload: {
      enunciado: "Explique os conceitos de velocidade, aceleração e movimento retilíneo uniforme. Dê exemplos práticos do cotidiano.",
      nomeAluno: "Teste Física",
      escola: "Colégio Teste",
      disciplina: "Física",
      serie: "1 Médio",
      templateId: "classico",
      incluirImagens: true
    }
  },
  {
    id: 2,
    nome: "História - Brasil Colônia",
    payload: {
      enunciado: "Descreva o processo de colonização do Brasil desde o descobramento até o ciclo do ouro. Quais foram os principais ciclos econômicos?",
      nomeAluno: "Teste História",
      escola: "Colégio Teste",
      disciplina: "História",
      serie: "8 Fundamental",
      templateId: "classico",
      incluirImagens: false
    }
  },
  {
    id: 3,
    nome: "Geografia - Urbanização",
    payload: {
      enunciado: "Explique o processo de urbanização no Brasil e seus problemas contemporâneos: trânsito, poluição, habitação e segregação espacial.",
      nomeAluno: "Teste Geografia",
      escola: "Colégio Teste",
      disciplina: "Geografia",
      serie: "9 Fundamental",
      templateId: "classico",
      incluirImagens: true
    }
  },
  {
    id: 4,
    nome: "Biologia - Célula",
    payload: {
      enunciado: "Descreva a estrutura e função da célula eukaryótica. Quais são as principais organelas e suas funções?",
      nomeAluno: "Teste Biologia",
      escola: "Colégio Teste",
      disciplina: "Biologia",
      serie: "2 Médio",
      templateId: "classico",
      incluirImagens: true
    }
  },
  {
    id: 5,
    nome: "Química - Tabela Periódica",
    payload: {
      enunciado: "Explique a organização da tabela periódica e as propriedades periódicas dos elementos. O que são metais, não metais e metaloides?",
      nomeAluno: "Teste Química",
      escola: "Colégio Teste",
      disciplina: "Química",
      serie: "1 Médio",
      templateId: "moderno",
      incluirImagens: false
    }
  },
  {
    id: 6,
    nome: "Português - Literatura",
    payload: {
      enunciado: "Analise o texto de um autor brasileiro. Qual é o tema principal e como o autor desenvolve a narrativa?",
      nomeAluno: "Teste Português",
      escola: "Colégio Teste",
      disciplina: "Português",
      serie: "3 Médio",
      templateId: "minimalista",
      incluirImagens: false
    }
  },
  {
    id: 7,
    nome: "Matemática - Funções",
    payload: {
      enunciado: "Explique o conceito de função matemática. O que é domínio, contradomínio e imagem? Dê exemplos de funções do cotidiano.",
      nomeAluno: "Teste Matemática",
      escola: "Colégio Teste",
      disciplina: "Matemática",
      serie: "1 Médio",
      templateId: "classico",
      incluirImagens: true
    }
  },
  {
    id: 8,
    nome: "Sociologia - Desigualdade",
    payload: {
      enumerado: "Analise as principais formas de desigualdade social no Brasil contemporâneo: racial, de gênero e de classe.",
      nomeAluno: "Teste Sociologia",
      escola: "Colégio Teste",
      disciplina: "Sociologia",
      serie: "2 Médio",
      templateId: "classico",
      incluirImagens: false
    }
  },
  {
    id: 9,
    nome: "Filosofia - Ética",
    payload: {
      enunciado: "Compare as teorias éticas de Kant e utilitarismo. Quais são as principais diferenças entre a ética deontológica e consequencialista?",
      nomeAluno: "Teste Filosofia",
      escola: "Colégio Teste",
      disciplina: "Filosofia",
      serie: "3 Médio",
      templateId: "classico",
      incluirImagens: false
    }
  },
  {
    id: 10,
    nome: "Artes - Impressionismo",
    payload: {
      enunciado: "Descreva as principais características do movimento impressionista na arte. Quais foram os principais artistas e suas obras?",
      nomeAluno: "Teste Artes",
      escola: "Colégio Teste",
      disciplina: "Arte",
      serie: "1 Médio",
      templateId: "colorido",
      incluirImagens: true
    }
  }
];

/**
 * 🎯 COMO USAR:
 * 
 * 1. NO BROWSER (mais fácil):
 *    - Acesse http://localhost:3000/dashboard
 *    - Faça login
 *    - Abra DevTools (F12) → aba Network
 *    - Gere um trabalho manualmente
 *    - Clique na requisição "gerar-pdf" → Copy as cURL
 *    - Cole no Postman/Insomnia e modifique o corpo
 * 
 * 2. NO POSTMAN/INSOMNIA:
 *    - POST http://localhost:3000/api/gerar-pdf
 *    - Headers: Content-Type: application/json
 *    - Auth: Bearer token (pegue do cookie)
 *    - Body: um dos payloads acima
 * 
 * 3. NO TERMINAL COM CURL:
 *    curl -X POST http://localhost:3000/api/gerar-pdf \
 *      -H "Content-Type: application/json" \
 *      -H "Authorization: Bearer SEU_TOKEN" \
 *      -d '{"enunciado":"...", "nomeAluno":"Teste", ...}'
 */

console.log('📋 ROTEIRO DE TESTE PRONTU');
console.log('==========================\n');

TESTES.forEach(t => {
  console.log(`${t.id}. ${t.nome}`);
  console.log(`   Disciplina: ${t.payload.disciplina}`);
  console.log(`   Imagens: ${t.payload.incluirImagens ? '✅ Sim' : '❌ Não'}`);
  console.log('');
});

// Exportar para uso em outros scripts
module.exports = { TESTES };

/**
 * Exemplo de chamada CURL para cada teste:
 */
console.log('\n📝 EXEMPLO CURL (teste 1):');
console.log('--------------------------');
const exemplo = TESTES[0];
console.log(`curl -X POST http://localhost:3000/api/gerar-pdf \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \\
  -d '${JSON.stringify(exemplo.payload, null, 2)}'`);