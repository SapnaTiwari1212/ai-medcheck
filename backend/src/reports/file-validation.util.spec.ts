import { BadRequestException } from '@nestjs/common';
import { validateUpload } from './file-validation.util';

const PNG_BUFFER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
const PDF_BUFFER = Buffer.from('%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n1 0 obj\nendobj\n%%EOF');

describe('validateUpload', () => {
  it('rejects when no file is provided', async () => {
    await expect(validateUpload(undefined)).rejects.toThrow(BadRequestException);
  });

  it('rejects files over 25 MB', async () => {
    const file = {
      buffer: Buffer.alloc(25 * 1024 * 1024 + 1),
      originalname: 'report.pdf',
      mimetype: 'application/pdf',
      size: 25 * 1024 * 1024 + 1,
    };
    await expect(validateUpload(file)).rejects.toThrow('25 MB');
  });

  it('rejects disallowed extensions', async () => {
    const file = {
      buffer: PDF_BUFFER,
      originalname: 'report.exe',
      mimetype: 'application/pdf',
      size: PDF_BUFFER.length,
    };
    await expect(validateUpload(file)).rejects.toThrow(BadRequestException);
  });

  it('rejects mismatched declared mimetype', async () => {
    const file = {
      buffer: PNG_BUFFER,
      originalname: 'report.png',
      mimetype: 'application/pdf',
      size: PNG_BUFFER.length,
    };
    await expect(validateUpload(file)).rejects.toThrow('File content does not match');
  });

  it('accepts a valid PDF upload', async () => {
    const file = {
      buffer: PDF_BUFFER,
      originalname: 'report.pdf',
      mimetype: 'application/pdf',
      size: PDF_BUFFER.length,
    };
    const result = await validateUpload(file);
    expect(result.mimeType).toBe('application/pdf');
    expect(result.extension).toBe('.pdf');
  });

  it('accepts a valid PNG upload', async () => {
    const file = {
      buffer: PNG_BUFFER,
      originalname: 'scan.png',
      mimetype: 'image/png',
      size: PNG_BUFFER.length,
    };
    const result = await validateUpload(file);
    expect(result.mimeType).toBe('image/png');
  });
});
