import { OcrSource } from '@prisma/client';

export interface OcrResult {
  text: string;
  source: OcrSource;
  pageCount: number;
}

export interface OcrProvider {
  readonly name: string;
  extract(buffer: Buffer, mimeType: string, options: OcrExtractOptions): Promise<OcrResult>;
}

export interface OcrExtractOptions {
  maxPages: number;
  maxChars: number;
}
