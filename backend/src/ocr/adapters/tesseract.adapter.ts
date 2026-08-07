import { Injectable, Logger } from '@nestjs/common';
import { OcrSource } from '@prisma/client';
import { createWorker } from 'tesseract.js';
import { OcrExtractOptions, OcrProvider, OcrResult } from '../ocr.interface';

function isPdf(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}

function isImage(mimeType: string): boolean {
  return /^image\/(jpe?g|png|webp|bmp|tiff?)$/.test(mimeType);
}

@Injectable()
export class TesseractOcrProvider implements OcrProvider {
  readonly name = 'tesseract';
  private readonly logger = new Logger(TesseractOcrProvider.name);

  async extract(buffer: Buffer, mimeType: string, options: OcrExtractOptions): Promise<OcrResult> {
    if (isPdf(mimeType)) return this.extractPdf(buffer, options);
    if (isImage(mimeType)) return this.extractImage(buffer, options);
    throw new Error(`Unsupported file type for OCR: ${mimeType}`);
  }

  private async extractPdf(buffer: Buffer, options: OcrExtractOptions): Promise<OcrResult> {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const { createCanvas } = await import('@napi-rs/canvas');

    const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
    const pageCount = Math.min(pdf.numPages, options.maxPages);

    const embeddedTexts: string[] = [];
    for (let i = 1; i <= pageCount; i += 1) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const lineText = content.items
        .map((item) => {
          const str = (item as { str?: string }).str;
          return typeof str === 'string' ? str : '';
        })
        .join(' ');
      embeddedTexts.push(lineText.replace(/\s+/g, ' ').trim());
    }

    const joinedEmbedded = embeddedTexts.filter(Boolean).join('\n');
    const meaningfulChars = (joinedEmbedded.match(/[a-zA-Z]/g) || []).length;
    if (meaningfulChars > 80) {
      return { text: joinedEmbedded.slice(0, options.maxChars), source: OcrSource.PDF_TEXT, pageCount };
    }

    this.logger.log('No embedded text found — running OCR on rendered pages');
    const worker = await createWorker('eng');
    const chunks: string[] = [];
    try {
      for (let i = 1; i <= pageCount; i += 1) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = createCanvas(viewport.width, viewport.height);
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx as unknown as CanvasRenderingContext2D, viewport }).promise;
        const png = canvas.toBuffer('image/png');
        const { data } = await worker.recognize(png);
        chunks.push(data.text);
      }
    } finally {
      await worker.terminate();
      await pdf.destroy();
    }

    return { text: chunks.join('\n').slice(0, options.maxChars), source: OcrSource.OCR, pageCount };
  }

  private async extractImage(buffer: Buffer, options: OcrExtractOptions): Promise<OcrResult> {
    const worker = await createWorker('eng');
    try {
      const { data } = await worker.recognize(buffer);
      return {
        text: data.text.slice(0, options.maxChars),
        source: OcrSource.IMAGE,
        pageCount: 1,
      };
    } finally {
      await worker.terminate();
    }
  }
}
