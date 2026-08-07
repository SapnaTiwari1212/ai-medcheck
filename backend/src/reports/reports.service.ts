import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { AnalysisResult, Prisma, Report, ReportStatus } from '@prisma/client';
import { Queue } from 'bullmq';
import { uuid } from '../common/utils/crypto.util';
import { paginate, PaginatedResult } from '../common/dto/pagination.dto';
import { ANALYSIS_QUEUE, OCR_QUEUE, OcrJobData, AnalysisJobData } from '../queues/queue.constants';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ListReportsQueryDto } from './dto/list-reports.dto';
import { validateUpload } from './file-validation.util';

export interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly config: ConfigService,
    @InjectQueue(OCR_QUEUE) private readonly ocrQueue: Queue<OcrJobData>,
    @InjectQueue(ANALYSIS_QUEUE) private readonly analysisQueue: Queue<AnalysisJobData>,
  ) {}

  async upload(userId: string, file?: MulterFile): Promise<Report> {
    const validated = await validateUpload(file);
    const originalName = file?.originalname ?? 'report';
    const key = `reports/${userId}/${uuid()}${validated.extension}`;

    const uploaded = await this.storage.save(validated.buffer, {
      key,
      mimeType: validated.mimeType,
      originalName,
    });

    const report = await this.prisma.report.create({
      data: {
        userId,
        originalName,
        storageKey: uploaded.storageKey,
        mimeType: validated.mimeType,
        fileSize: validated.buffer.length,
        storageProvider: uploaded.provider,
        status: ReportStatus.OCR_PENDING,
      },
    });

    await this.ocrQueue.add('extract', {
      reportId: report.id,
      storageKey: report.storageKey,
      mimeType: report.mimeType,
      originalName: report.originalName,
    }, this.jobOptions());

    return report;
  }

  async list(userId: string, query: ListReportsQueryDto): Promise<PaginatedResult<Report>> {
    const { page, limit, status } = query;
    const where: Prisma.ReportWhereInput = { userId, deletedAt: null, ...(status ? { status } : {}) };

    const [items, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ]);

    return paginate(items, total, page, limit);
  }

  async findById(userId: string, reportId: string): Promise<Report> {
    const report = await this.prisma.report.findFirst({
      where: { id: reportId, userId, deletedAt: null },
    });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async getText(userId: string, reportId: string): Promise<{ ocrText: string | null; ocrSource: string | null; status: ReportStatus }> {
    const report = await this.findById(userId, reportId);
    return {
      ocrText: report.ocrText,
      ocrSource: report.ocrSource,
      status: report.status,
    };
  }

  async delete(userId: string, reportId: string): Promise<void> {
    const report = await this.findById(userId, reportId);
    await this.storage.delete(report.storageKey).catch((err: Error) =>
      this.logger.warn(`Failed to delete report file ${report.storageKey}: ${err.message}`),
    );
    await this.prisma.report.update({ where: { id: reportId }, data: { deletedAt: new Date() } });
  }

  async getAnalysis(userId: string, reportId: string): Promise<AnalysisResult | null> {
    await this.findById(userId, reportId);
    return this.prisma.analysisResult.findUnique({ where: { reportId } });
  }

  async requestAnalysis(userId: string, reportId: string): Promise<Report> {
    const report = await this.findById(userId, reportId);
    if (!report.ocrText) {
      throw new BadRequestException('OCR has not completed for this report yet');
    }

    const updated = await this.prisma.report.update({
      where: { id: reportId },
      data: { status: ReportStatus.ANALYSIS_PENDING, analysisStartedAt: new Date() },
    });

    await this.analysisQueue.add('analyze', { reportId }, this.jobOptions());

    return updated;
  }

  private jobOptions() {
    return {
      attempts: this.config.get<number>('queue.attempts') ?? 3,
      backoff: { type: 'exponential' as const, delay: this.config.get<number>('queue.backoff') ?? 5000 },
      removeOnComplete: 100,
      removeOnFail: 500,
    };
  }
}
