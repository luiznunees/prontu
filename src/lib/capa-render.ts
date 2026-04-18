import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'fs';

/**
 * Tenta localizar o executável do Chrome ou Edge no Windows local.
 */
function getLocalExecutablePath(): string | null {
  const paths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];

  for (const path of paths) {
    if (fs.existsSync(path)) return path;
  }
  return null;
}

/**
 * Renderiza o HTML da capa para um Buffer PNG de alta qualidade usando Puppeteer.
 * Otimizado para rodar tanto localmente (Windows/Chrome) quanto em produção (Vercel).
 */
export async function renderCapaToBuffer(html: string): Promise<Buffer> {
  const isDev = process.env.NODE_ENV === 'development' || !process.env.VERCEL;
  let executablePath: string;

  if (isDev) {
    // No Windows local, tentamos usar o Chrome/Edge do sistema
    const localPath = getLocalExecutablePath();
    if (!localPath) {
      throw new Error("Não foi possível encontrar o Chrome ou Edge localmente. Instale o Google Chrome.");
    }
    executablePath = localPath;
  } else {
    // Em produção (Vercel), usamos o binário leve do @sparticuz/chromium
    executablePath = await chromium.executablePath();
  }
  
  const browser = await puppeteer.launch({
    args: isDev ? [] : chromium.args,
    defaultViewport: { width: 595, height: 842 },
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();
    
    // Define o conteúdo HTML e aguarda o carregamento das fontes/recursos
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Captura screenshot da página inteira no formato PNG
    const buffer = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 595, height: 842 },
      omitBackground: false,
    });

    return buffer as Buffer;
  } finally {
    await browser.close();
  }
}
