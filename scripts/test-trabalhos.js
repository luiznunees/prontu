#!/usr/bin/env node

/**
 * Script de Teste - Prontu
 * Gera trabalhos sobre vários temas para comparação
 * 
 * Uso: node scripts/test-trabalhos.js
 * 
 * Precisa estar logado (executar login antes no browser)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const TEMAS_TESTE = [
  {
    nome: 'Física - Movimentos',
    enunciado: 'Explique os conceitos de velocidade, aceleração e movimento retilíneo uniforme. Dê exemplos práticos do cotidiano.',
    disciplina: 'Física',
    serie: '1 Médio',
    incluirImagens: true
  },
  {
    nome: 'História - Brasil Colônia',
    enunciado: 'Descreva o processo de colonização do Brasil desde o descobramento até o ciclo do ouro. Quais foram os principais ciclos econômicos?',
    disciplina: 'História',
    serie: '8 Fundamental',
    incluirImagens: true
  },
  {
    nome: 'Geografia - Urbanização',
    enunciado: 'Explique o processo de urbanização no Brasil e seus problemas contemporâneos: trânsito, poluição, habitação e segregação espacial.',
    disciplina: 'Geografia',
    serie: '9 Fundamental',
    incluirImagens: true
  },
  {
    nome: 'Biologia - Célula',
    enunciado: 'Descreva a estrutura e função da célula eukaryótica. Quais são as principais organelas e suas funções?',
    disciplina: 'Biologia',
    serie: '2 Médio',
    incluirImagens: true
  },
  {
    nome: 'Química - Tabela Periódica',
    enunciado: 'Explique a organização da tabela periódica e as propriedades periódicas dos elementos. O que são metais, não metais e metaloides?',
    disciplina: 'Química',
    serie: '1 Médio',
    incluirImagens: false
  },
  {
    nome: 'Português - Interpretação',
    enunciado: 'Analyse o texto "A Causa das Coisas" de Machado de Assis. Qual é o tema principal e como o autor desenvolve a narrativa?',
    disciplina: 'Português',
    serie: '3 Médio',
    incluirImagens: false
  },
  {
    nome: 'Matemática - Funções',
    enunciado: 'Explique o conceito de função matemática. O que é domínio, contradomínio e imagem? Dê exemplos de funções do cotidiano.',
    disciplina: 'Matemática',
    serie: '1 Médio',
    incluirImagens: true
  },
  {
    nome: 'Sociologia - Desigualdade',
    enumere: 'Analise as principais formas de desigualdade social no Brasil contemporâneo: racial, de gênero e de classe. Quais políticas públicas existem para minimizar essas diferenças?',
    disciplina: 'Sociologia',
    serie: '2 Médio',
    incluirImagens: false
  },
  {
    nome: 'Filosofia - Ética',
    enumere: 'Compare as teorias éticas de Kant e utilitarismo. Quais são as principais diferenças entre a ética deontológica e consequencialista?',
    disciplina: 'Filosofia',
    serie: '3 Médio',
    incluirImagens: false
  },
  {
    nome: 'Artes - Impressionismo',
    enumere: 'Descreva as principais características do movimento impressionista na arte. Quais foram os principais artistas e suas obras?',
    disciplina: 'Arte',
    serie: '1 Médio',
    incluirImagens: true
  }
];

const OUTPUT_DIR = path.join(__dirname, '..', 'test-results');

async function makeRequest(data, sessionCookie) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}/api/gerar-pdf`);
    const protocol = url.protocol === 'https:' ? https : http;

    const postData = JSON.stringify(data);

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Cookie': sessionCookie
      }
    };

    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, body: response });
        } catch (e) {
          reject(new Error('Resposta inválida: ' + body.substring(0, 500)));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function savePDF(base64Data, filename) {
  const buffer = Buffer.from(base64Data, 'base64');
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, buffer);
  return filepath;
}

async function runTests() {
  console.log('🧪 PRONTU - Script de Teste de Trabalhos\n');
  console.log('=' .repeat(50));

  // Verificar se tem cookie de sessão
  const sessionCookie = process.env.PRONTU_SESSION_COOKIE;
  if (!sessionCookie) {
    console.log('\n⚠️  Para rodar os testes, você precisa:');
    console.log('   1. Fazer login no site em http://localhost:3000');
    console.log('   2. Copiar o cookie "sb-access-token" ou "sb-session"');
    console.log('   3. Exportar: export PRONTU_SESSION_COOKIE="valor_do_cookie"');
    console.log('\n   Alternativamente, pode testar manualmente no Postman ou browser.');
    console.log('\n📝 Lista de temas para teste:\n');
    
    TEMAS_TESTE.forEach((tema, i) => {
      console.log(`   ${i + 1}. ${tema.nome} (${tema.disciplina})`);
      console.log(`      "${tema.enunciado.substring(0, 60)}..."\n`);
    });
    return;
  }

  // Criar diretório de saída
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`\n📁 Saída: ${OUTPUT_DIR}\n`);

  const resultados = [];

  for (let i = 0; i < TEMAS_TESTE.length; i++) {
    const tema = TEMAS_TESTE[i];
    const sanitizedNome = tema.nome.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${sanitizedNome}_${timestamp}.pdf`;

    console.log(`[${i + 1}/${TEMA_TESTE.length}] Gerando: ${tema.nome}...`);

    try {
      const startTime = Date.now();
      
      const response = await makeRequest({
        enunciado: tema.enunciado,
        nomeAluno: 'Teste Automático',
        escola: 'Colégio Teste',
        disciplina: tema.disciplina,
        serie: tema.serie,
        templateId: 'classico',
        incluirImagens: tema.incluirImagens
      }, sessionCookie);

      const duration = Date.now() - startTime;

      if (response.status === 200 && response.body.pdfBase64) {
        const filepath = savePDF(response.body.pdfBase64, filename);
        console.log(`   ✅ Sucesso! (${duration}ms) → ${path.basename(filepath)}`);
        console.log(`   📄 Tipo: ${response.body.tipoCredito}, Créditos restantes: ${response.body.creditosRestantes}`);
        
        resultados.push({
          tema: tema.nome,
          status: 'sucesso',
          duration,
          arquivo: path.basename(filepath),
          tipoCredito: response.body.tipoCredito
        });
      } else {
        console.log(`   ❌ Erro: ${response.body.error || 'Erro desconhecido'}`);
        resultados.push({
          tema: tema.nome,
          status: 'erro',
          erro: response.body.error
        });
      }
    } catch (err) {
      console.log(`   ❌ Erro na requisição: ${err.message}`);
      resultados.push({
        tema: tema.nome,
        status: 'erro',
        erro: err.message
      });
    }

    // Intervalo entre requisições para não sobrecarregar
    if (i < TEMAS_TESTE.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Relatório final
  console.log('\n' + '='.repeat(50));
  console.log('📊 RELATÓRIO FINAL');
  console.log('='.repeat(50));

  const sucessos = resultados.filter(r => r.status === 'sucesso');
  const erros = resultados.filter(r => r.status === 'erro');

  console.log(`\n✅ Sucessos: ${sucessos.length}/${TEMA_TESTE.length}`);
  console.log(`❌ Erros: ${erros.length}/${TEMA_TESTE.length}`);

  if (sucessos.length > 0) {
    const avgDuration = sucessos.reduce((sum, r) => sum + r.duration, 0) / sucessos.length;
    console.log(`⏱️  Tempo médio: ${Math.round(avgDuration)}ms por trabalho`);
  }

  console.log('\n📄 Arquivos gerados:');
  sucessos.forEach(r => {
    console.log(`   - ${r.arquivo}`);
  });

  if (erros.length > 0) {
    console.log('\n⚠️  Erros:');
    erros.forEach(r => {
      console.log(`   - ${r.tema}: ${r.erro}`);
    });
  }

  // Salvar relatório em JSON
  const relatorioPath = path.join(OUTPUT_DIR, `relatorio_${Date.now()}.json`);
  fs.writeFileSync(relatorioPath, JSON.stringify({
    data: new Date().toISOString(),
    total: TEMAS_TESTE.length,
    sucessos: sucessos.length,
    erros: erros.length,
    resultados
  }, null, 2));

  console.log(`\n💾 Relatório salvo em: ${relatorioPath}`);
}

// Allow running without arguments
runTests().catch(console.error);