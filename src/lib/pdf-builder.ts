import { PDFDocument, rgb, PDFPage, PDFFont, RGB } from "pdf-lib";
import { TrabalhoGerado } from "./gemini";
import { getTemplate, TemplateId } from "./templates";

export interface BuildPDFInput {
  trabalho: TrabalhoGerado;
  templateId?: TemplateId;
  config: {
    nomeAluno: string;
    escola: string;
    disciplina: string;
    serie: string;
    cidade?: string;
    ano?: string;
  };
  
  imagens?: string[];
}

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN_LEFT = 85;

const sanitizeText = (text: string): string => {
  if (!text) return "";

  const charMap: { [key: string]: string } = {
    "Δ": "D", "°": "o", "×": "x", "→": "->", "←": "<-",
    "²": "2", "³": "3", "½": "1/2", "¼": "1/4",
    "á": "á", "é": "é", "í": "í", "ó": "ó", "ú": "ú",
    "â": "â", "ê": "ê", "î": "î", "ô": "ô", "û": "û",
    "ã": "ã", "õ": "õ", "ç": "ç", "ñ": "ñ", "à": "à",
    "ü": "ü", "ö": "ö", "ä": "ä",
    "Á": "Á", "É": "É", "Í": "Í", "Ó": "Ó", "Ú": "Ú",
    "Â": "Â", "Ê": "Ê", "Î": "Î", "Ô": "Ô", "Û": "Û",
    "Ã": "Ã", "Õ": "Õ", "Ç": "Ç", "À": "À"
  };

  let sanitized = text;
  Object.keys(charMap).forEach(char => {
    sanitized = sanitized.split(char).join(charMap[char]);
  });

  return sanitized.replace(/[^\u0000-\u00FF]/g, "");
};

function wrapTitle(title: string, maxCharsPerLine: number): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length <= maxCharsPerLine) {
      currentLine += (currentLine === "" ? "" : " ") + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

interface DrawTextConfig {
  x: number;
  y: number;
  maxWidth: number;
  font: PDFFont;
  size: number;
  lineHeight: number;
  color: RGB;
  align?: "left" | "justify" | "center";
  firstLineIndent?: number;
  fontBold?: PDFFont;
}

function drawTextWithBold(page: PDFPage, text: string, config: DrawTextConfig): number {
  const { x, y, maxWidth, font, fontBold, size, lineHeight, color, align = "left", firstLineIndent = 0 } = config;
  const cleanText = sanitizeText(text);
  
  const parts: { text: string; bold: boolean }[] = [];
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  
  while ((match = boldRegex.exec(cleanText)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: cleanText.slice(lastIndex, match.index), bold: false });
    }
    parts.push({ text: match[1], bold: true });
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < cleanText.length) {
    parts.push({ text: cleanText.slice(lastIndex), bold: false });
  }
  
  if (!parts.some(p => p.bold)) {
    return drawTextBlock(page, text, config);
  }
  
  const words = cleanText.split(/\s+/);
  const lines: string[][] = [];
  let currentLine: string[] = [];

  words.forEach((word) => {
    const isFirstLine = lines.length === 0;
    const currentMaxW = isFirstLine ? maxWidth - firstLineIndent : maxWidth;
    const testLine = [...currentLine, word].join(" ");
    const width = font.widthOfTextAtSize(testLine, size);
    if (width <= currentMaxW) {
      currentLine.push(word);
    } else {
      lines.push(currentLine);
      currentLine = [word];
    }
  });
  if (currentLine.length > 0) lines.push(currentLine);
  
  let cursorY = y;
  lines.forEach((lineWords, index) => {
    const isFirstLine = index === 0;
    let drawX = isFirstLine ? x + firstLineIndent : x;
    
    lineWords.forEach((word) => {
      const isBold = word.startsWith("**") && word.endsWith("**");
      const cleanWord = word.replace(/\*\*/g, "");
      const currentFont = isBold && fontBold ? fontBold : font;
      
      page.drawText(cleanWord, { 
        x: drawX, 
        y: cursorY, 
        size, 
        font: currentFont, 
        color 
      });
      drawX += currentFont.widthOfTextAtSize(cleanWord, size) + font.widthOfTextAtSize(" ", size);
    });
    cursorY -= lineHeight;
  });
  
  return cursorY;
}

function drawCenteredText(page: PDFPage, text: string, y: number, size: number, font: PDFFont, color: RGB) {
  const clean = sanitizeText(text);
  const width = font.widthOfTextAtSize(clean, size);
  page.drawText(clean, {
    x: (A4_WIDTH - width) / 2,
    y,
    size,
    font,
    color
  });
}

function drawTextBlock(page: PDFPage, text: string, config: DrawTextConfig): number {
  const { x, y, maxWidth, font, size, lineHeight, color, align = "left", firstLineIndent = 0 } = config;
  const cleanText = sanitizeText(text);
  const words = cleanText.split(/\s+/);

  const lines: string[][] = [];
  let currentLine: string[] = [];

  words.forEach((word) => {
    const isFirstLine = lines.length === 0;
    const currentMaxW = isFirstLine ? maxWidth - firstLineIndent : maxWidth;

    const testLine = [...currentLine, word].join(" ");
    const width = font.widthOfTextAtSize(testLine, size);

    if (width <= currentMaxW) {
      currentLine.push(word);
    } else {
      lines.push(currentLine);
      currentLine = [word];
    }
  });
  if (currentLine.length > 0) lines.push(currentLine);

  let cursorY = y;
  lines.forEach((lineWords, index) => {
    const isFirstLine = index === 0;
    const isLastLine = index === lines.length - 1;
    const lineText = lineWords.join(" ");

    let drawX = isFirstLine ? x + firstLineIndent : x;
    const currentMaxW = isFirstLine ? maxWidth - firstLineIndent : maxWidth;

    if (align === "center") {
      const width = font.widthOfTextAtSize(lineText, size);
      drawX = x + (maxWidth - width) / 2;
      page.drawText(lineText, { x: drawX, y: cursorY, size, font, color });
    } else if (align === "justify" && !isLastLine && lineWords.length > 1) {
      const totalWidth = font.widthOfTextAtSize(lineText, size);
      const extraSpace = currentMaxW - totalWidth;
      const spacePerGap = extraSpace / (lineWords.length - 1);

      let currentX = drawX;
      lineWords.forEach((word) => {
        page.drawText(word, { x: currentX, y: cursorY, size, font, color });
        const wordWidth = font.widthOfTextAtSize(word, size);
        const gapWidth = font.widthOfTextAtSize(" ", size);
        currentX += wordWidth + gapWidth + spacePerGap;
      });
    } else {
      page.drawText(lineText, { x: drawX, y: cursorY, size, font, color });
    }
    cursorY -= lineHeight;
  });

  return cursorY;
}

export async function buildPDF(input: BuildPDFInput): Promise<Uint8Array> {
  const { trabalho, config, templateId = "classico", imagens = [] } = input;
  const template = getTemplate(templateId);

  const pdfDoc = await PDFDocument.create();

  const fontRegular = await pdfDoc.embedFont(template.fonte);
  const fontBold = await pdfDoc.embedFont(template.fonteBold);
  const fontItalic = await pdfDoc.embedFont(template.fonteItalic);

  const black = rgb(0, 0, 0);
  const colorTitulo = rgb(template.corTitulo.r, template.corTitulo.g, template.corTitulo.b);
  const colorTexto = rgb(template.corTexto.r, template.corTexto.g, template.corTexto.b);

  // --- CAPA ---
  const page1 = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  page1.drawRectangle({
    x: 0,
    y: 0,
    width: A4_WIDTH,
    height: A4_HEIGHT,
    color: rgb(0.05, 0.15, 0.35),
  });
  const tituloLines = wrapTitle(trabalho.titulo.toUpperCase(), 30);
  const tituloY = 600;
  tituloLines.forEach((line, i) => {
    const lineWidth = fontBold.widthOfTextAtSize(line, 24);
    page1.drawText(line, { x: (A4_WIDTH - lineWidth) / 2, y: tituloY - (i * 30), size: 24, font: fontBold, color: rgb(1, 1, 1) });
  });
  const discWidth = fontRegular.widthOfTextAtSize(trabalho.disciplina.toUpperCase(), 14);
  page1.drawText(trabalho.disciplina.toUpperCase(), { x: (A4_WIDTH - discWidth) / 2, y: 280, size: 14, font: fontRegular, color: rgb(0.9, 0.9, 0.9) });

  // --- FOLHA DE ROSTO ---
  const page2 = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  page2.drawRectangle({
    x: 0,
    y: 0,
    width: A4_WIDTH,
    height: A4_HEIGHT,
    color: rgb(1, 1, 1),
  });
  page2.drawRectangle({
    x: 40,
    y: 40,
    width: A4_WIDTH - 80,
    height: A4_HEIGHT - 80,
    borderColor: rgb(0.05, 0.15, 0.35),
    borderWidth: 2,
  });

  const tituloLines2 = wrapTitle(trabalho.titulo.toUpperCase(), 35);
  const tituloStartY = 680;
  const tituloSize = 20;
  tituloLines2.forEach((line, i) => {
    const lineWidth = fontBold.widthOfTextAtSize(line, tituloSize);
    const lineX = (A4_WIDTH - lineWidth) / 2;
    page2.drawText(line, { x: lineX, y: tituloStartY - (i * tituloSize * 1.5), size: tituloSize, font: fontBold, color: black });
  });

  const nota = `Disciplina: ${config.disciplina}`;
  const nota2 = `Turma: ${config.serie}`;
  page2.drawText(nota, { x: MARGIN_LEFT, y: 350, size: 12, font: fontRegular, color: black });
  page2.drawText(nota2, { x: MARGIN_LEFT, y: 330, size: 12, font: fontRegular, color: black });

  // --- IMAGENS ---
  const imagensEmbeddadas: { img: any; width: number; height: number }[] = [];
  for (const imgUrl of imagens.slice(0, 3)) {
    try {
      let arrayBuffer: ArrayBuffer;

      if (imgUrl.startsWith("data:")) {
        const base64Data = imgUrl.split(",")[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        arrayBuffer = bytes.buffer;
      } else {
        const response = await fetch(imgUrl);
        arrayBuffer = await response.arrayBuffer();
      }

      const firstByte = new Uint8Array(arrayBuffer)[0];
      let img;
      if (firstByte === 0x89) {
        img = await pdfDoc.embedPng(arrayBuffer);
      } else {
        img = await pdfDoc.embedJpg(arrayBuffer);
      }

      const maxWidth = 490;
      const scale = maxWidth / img.width;
      const width = Math.min(img.width, maxWidth);
      const height = img.height * scale;

      imagensEmbeddadas.push({ img, width, height });
    } catch (e) {
      console.error("Erro ao embedar imagem:", e);
    }
  }

  // --- CONTEÚDO (ABNT) ---
  const MARGIN_TOP = 85;
  const MARGIN_RIGHT = 56;
  const MARGIN_BOTTOM = 56;
  const MAX_CONTENT_WIDTH = A4_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

  let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let currentY = A4_HEIGHT - MARGIN_TOP;

  const checkNewPage = (neededHeight: number) => {
    if (currentY - neededHeight < MARGIN_BOTTOM) {
      currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      currentY = A4_HEIGHT - MARGIN_TOP;
      return true;
    }
    return false;
  };

  for (const secao of trabalho.secoes) {
    checkNewPage(40);
    currentY = drawTextBlock(currentPage, secao.titulo.toUpperCase(), {
      x: MARGIN_LEFT,
      y: currentY,
      maxWidth: MAX_CONTENT_WIDTH,
      font: fontBold,
      size: template.tamanhoTitulo,
      lineHeight: template.tamanhoTitulo * 1.5,
      color: colorTitulo,
      align: "left",
    });
    currentY -= 16;

    const conteudoNormalizado = secao.conteudo
      .replace(/\n{3,}/g, "\n\n")
      .replace(/([^\n])\n([^\n])/g, "$1 $2")
      .trim();

    const paragraphs = conteudoNormalizado.split("\n\n").filter(p => p.trim());
    const secaoIndex = trabalho.secoes.indexOf(secao);
    let paragrafoIndex = 0;

    for (const para of paragraphs) {
      if (!para.trim()) continue;

      const approxLines = Math.ceil((para.length / 50));
      checkNewPage(approxLines * template.tamanhoCorpo * template.espacoEntreLinhas + 20);

      const temBold = para.includes("**");
      if (temBold) {
        currentY = drawTextWithBold(currentPage, para.trim(), {
          x: MARGIN_LEFT,
          firstLineIndent: template.recuoParagrafo,
          y: currentY,
          maxWidth: MAX_CONTENT_WIDTH,
          font: fontRegular,
          fontBold,
          size: template.tamanhoCorpo,
          lineHeight: template.tamanhoCorpo * template.espacoEntreLinhas,
          color: colorTexto,
          align: "justify",
        });
      } else {
        currentY = drawTextBlock(currentPage, para.trim(), {
          x: MARGIN_LEFT,
          firstLineIndent: template.recuoParagrafo,
          y: currentY,
          maxWidth: MAX_CONTENT_WIDTH,
          font: fontRegular,
          size: template.tamanhoCorpo,
          lineHeight: template.tamanhoCorpo * template.espacoEntreLinhas,
          color: colorTexto,
          align: "justify",
        });
      }
      currentY -= 12;

      if (secaoIndex === 1 && paragrafoIndex === 0 && imagensEmbeddadas.length > 0) {
        for (const imgData of imagensEmbeddadas) {
          checkNewPage(imgData.height + 30);
          const imgX = MARGIN_LEFT;
          currentPage.drawImage(imgData.img, {
            x: imgX,
            y: currentY - imgData.height,
            width: imgData.width,
            height: imgData.height,
          });
          currentY -= (imgData.height + 20);
        }
      }
      paragrafoIndex++;
    }
    currentY -= 20;
  }

  // --- REFERÊNCIAS ---
  checkNewPage(100);
  currentY = drawTextBlock(currentPage, "REFERÊNCIAS", {
    x: MARGIN_LEFT,
    y: currentY,
    maxWidth: MAX_CONTENT_WIDTH,
    font: fontBold,
    size: template.tamanhoTitulo,
    lineHeight: template.tamanhoTitulo * 1.5,
    color: colorTitulo,
    align: "left",
  });
  currentY -= 20;

  for (const ref of trabalho.referencias) {
    checkNewPage(30);
    currentY = drawTextBlock(currentPage, ref, {
      x: MARGIN_LEFT,
      y: currentY,
      maxWidth: MAX_CONTENT_WIDTH,
      font: fontRegular,
      size: template.tamanhoCorpo,
      lineHeight: template.tamanhoCorpo * 1.2,
      color: colorTexto,
      align: "left",
    });
    currentY -= 8;
  }

  return pdfDoc.save();
}