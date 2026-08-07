export const OCR_QUEUE = 'ocr';
export const ANALYSIS_QUEUE = 'analysis';

export interface OcrJobData {
  reportId: string;
  storageKey: string;
  mimeType: string;
  originalName: string;
}

export interface AnalysisJobData {
  reportId: string;
}

export const QUEUE_NAMES = [OCR_QUEUE, ANALYSIS_QUEUE] as const;
