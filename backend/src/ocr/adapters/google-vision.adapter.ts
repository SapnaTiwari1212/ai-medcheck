import { Injectable, Logger } from '@nestjs/common';
import { OcrSource } from '@prisma/client';
import { OcrExtractOptions, OcrProvider, OcrResult } from '../ocr.interface';

function isPdf(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}

function isImage(mimeType: string): boolean {
  return /^image\/(jpe?g|png|webp|bmp|tiff?)$/.test(mimeType);
}

@Injectable()
export class GoogleVisionOcrProvider implements OcrProvider {
  readonly name = 'google_vision';
  private readonly logger = new Logger(GoogleVisionOcrProvider.name);

  async extract(buffer: Buffer, mimeType: string, options: OcrExtractOptions): Promise<OcrResult> {
    if (!isPdf(mimeType) && !isImage(mimeType)) {
      throw new Error(`Unsupported file type for OCR: ${mimeType}`);
    }

    if (isPdf(mimeType)) {
      // Google Vision PDF API is async (GCS-based); local text extraction is not supported.
      throw new Error(
        'Google Vision PDF OCR requires the async GCS flow. Use the tesseract provider for direct PDF uploads.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let vision: any;
    try {
      vision = await import('@google-cloud/vision');
    } catch {
      throw new Error(
        'The @google-cloud/vision package is not installed. Install it and set GOOGLE_APPLICATION_CREDENTIALS to use Google Vision OCR.',
      );
    }

    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.annotateImage({
      image: { content: buffer.toString('base64') },
      features: [{ type: 'TEXT_DETECTION' }],
    });

    const text = result?.fullTextAnnotation?.text ?? '';
    return {
      text: String(text).slice(0, options.maxChars),
      source: OcrSource.IMAGE,
      pageCount: 1,
    };
  }
}
