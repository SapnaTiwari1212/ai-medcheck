import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ReportStatus } from '@prisma/client';
import { Job, Queue } from 'bullmq';
import { OcrService } from '../ocr/ocr.service';
import { PrismaService } from '../prisma/prisma.service';
import { AnalysisJobData, ANALYSIS_QUEUE, OcrJobData } from '../queues/queue.constants';
import { StorageService } from '../storage/storage.service';

@Processor('ocr')
export class OcrProcessor extends WorkerHost {
  private readonly logger = new Logger(OcrProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly ocr: OcrService,
    @InjectQueue(ANALYSIS_QUEUE) private readonly analysisQueue: Queue<AnalysisJobData>,
  ) {
    super();
  }

  async process(job: Job<OcrJobData>): Promise<void> {
    const { reportId, storageKey, mimeType } = job.data;

    const report = await this.prisma.report.findFirst({
      where: { id: reportId, deletedAt: null },
    });
    if (!report) {
      this.logger.warn(`OCR job for missing report ${reportId} — skipping`);
      return;
    }

    await this.prisma.report.update({
      where: { id: reportId },
      data: { status: ReportStatus.OCR_PENDING, ocrStartedAt: new Date() },
    });

    try {
      const buffer = await this.storage.getBuffer(storageKey);
      const result = await this.ocr.extract(buffer, mimeType);

      if (!result.text || result.text.trim().length === 0) {
        throw new Error('No text could be extracted from the file');
      }

      await this.prisma.report.update({
        where: { id: reportId },
        data: {
          ocrText: result.text,
          ocrSource: result.source,
          pageCount: result.pageCount,
          status: ReportStatus.OCR_COMPLETED,
          ocrCompletedAt: new Date(),
        },
      });

      this.logger.log(`OCR complete for report ${reportId} (source=${result.source}, pages=${result.pageCount})`);

      await this.analysisQueue.add('analyze', { reportId }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 500,
      });
    } catch (err) {
      this.logger.error(`OCR failed for report ${reportId}: ${(err as Error).message}`);
      await this.prisma.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.FAILED,
          errorMessage: `OCR failed: ${(err as Error).message}`,
        },
      });
      throw err;
    }
  }
}
