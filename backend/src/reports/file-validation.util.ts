import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png']);
const ALLOWED_MIMES = new Set(['application/pdf', 'image/jpeg', 'image/png']);

const PDF_MAGIC = '%PDF-';
const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

export interface ValidatedFile {
  buffer: Buffer;
  mimeType: string;
  extension: string;
}

function detectMimeType(buffer: Buffer): string | null {
  if (buffer.length >= PDF_MAGIC.length && buffer.subarray(0, 5).toString('latin1') === PDF_MAGIC) {
    return 'application/pdf';
  }
  if (
    buffer.length >= JPEG_MAGIC.length &&
    JPEG_MAGIC.every((byte, i) => buffer[i] === byte)
  ) {
    return 'image/jpeg';
  }
  if (
    buffer.length >= PNG_MAGIC.length &&
    PNG_MAGIC.every((byte, i) => buffer[i] === byte)
  ) {
    return 'image/png';
  }
  return null;
}

export async function validateUpload(file?: {
  buffer?: Buffer;
  originalname?: string;
  mimetype?: string;
  size?: number;
}): Promise<ValidatedFile> {
  if (!file || !file.buffer) {
    throw new BadRequestException('No file was uploaded');
  }

  if (file.size !== undefined && file.size > MAX_UPLOAD_BYTES) {
    throw new BadRequestException('File size exceeds the 25 MB limit');
  }

  const originalName = file.originalname ?? 'file';
  const extension = extname(originalName).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new BadRequestException('Only PDF, JPG, JPEG and PNG files are allowed');
  }

  const declaredMime = file.mimetype ?? '';
  if (!ALLOWED_MIMES.has(declaredMime)) {
    throw new BadRequestException('Invalid file type');
  }

  const detectedMime = detectMimeType(file.buffer);
  if (detectedMime && detectedMime !== declaredMime) {
    throw new BadRequestException('File content does not match its declared type');
  }

  return { buffer: file.buffer, mimeType: declaredMime, extension };
}
