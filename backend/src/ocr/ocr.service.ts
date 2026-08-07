import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleVisionOcrProvider } from './adapters/google-vision.adapter';
import { TesseractOcrProvider } from './adapters/tesseract.adapter';
import { OcrExtractOptions, OcrProvider, OcrResult } from './ocr.interface';

@Injectable()
export class OcrService implements OnModuleInit {
  private readonly logger = new Logger(OcrService.name);
  private provider: OcrProvider;
  private readonly extractOptions: OcrExtractOptions;

  constructor(private readonly config: ConfigService) {
    this.extractOptions = {
      maxPages: this.config.get<number>('ocr.maxPages') ?? 20,
      maxChars: this.config.get<number>('ocr.maxChars') ?? 60000,
    };
  }

  onModuleInit(): void {
    const configured = this.config.get<'tesseract' | 'google_vision'>('ocr.provider') ?? 'tesseract';
    if (configured === 'google_vision') {
      this.provider = new GoogleVisionOcrProvider();
      this.logger.log('OCR provider active: google_vision');
    } else {
      this.provider = new TesseractOcrProvider();
      this.logger.log('OCR provider active: tesseract');
    }
  }

  get providerName(): string {
    return this.provider.name;
  }

  extract(buffer: Buffer, mimeType: string): Promise<OcrResult> {
    return this.provider.extract(buffer, mimeType, this.extractOptions);
  }
}
