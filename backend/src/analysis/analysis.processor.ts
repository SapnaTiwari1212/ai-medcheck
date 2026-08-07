import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { RiskLevel, ReportStatus } from '@prisma/client';
import { Job } from 'bullmq';
import { AiService } from '../ai/ai.service';
import { DISCLAIMER } from '../ai/providers/openai.provider';
import { PrismaService } from '../prisma/prisma.service';
import { AnalysisJobData } from '../queues/queue.constants';

@Processor('analysis')
export class AnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalysisProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {
    super();
  }

  async process(job: Job<AnalysisJobData>): Promise<void> {
    const { reportId } = job.data;
    const startedAt = Date.now();

    const report = await this.prisma.report.findFirst({
      where: { id: reportId, deletedAt: null },
    });
    if (!report) {
      this.logger.warn(`Analysis job for missing report ${reportId} — skipping`);
      return;
    }
    if (!report.ocrText) {
      throw new Error('Report has no OCR text to analyze');
    }

    await this.prisma.report.update({
      where: { id: reportId },
      data: { status: ReportStatus.ANALYSIS_PENDING, analysisStartedAt: new Date() },
    });

    try {
      const result = await this.ai.analyze(report.ocrText);

      await this.prisma.analysisResult.upsert({
        where: { reportId },
        create: {
          reportId,
          overallSummary: result.overallSummary,
          healthScore: result.healthScore,
          riskLevel: result.riskLevel as RiskLevel,
          disclaimer: result.disclaimer || DISCLAIMER,
          rawJson: result as unknown as object,
          aiModel: this.ai.providerName,
          durationMs: Date.now() - startedAt,
        },
        update: {
          overallSummary: result.overallSummary,
          healthScore: result.healthScore,
          riskLevel: result.riskLevel as RiskLevel,
          disclaimer: result.disclaimer || DISCLAIMER,
          rawJson: result as unknown as object,
          aiModel: this.ai.providerName,
          durationMs: Date.now() - startedAt,
        },
      });

      await this.prisma.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.COMPLETED,
          analyzedAt: new Date(),
          errorMessage: null,
        },
      });

      this.logger.log(
        `Analysis complete for report ${reportId} (score=${result.healthScore}, risk=${result.riskLevel}, provider=${this.ai.providerName}, ${Date.now() - startedAt}ms)`,
      );
    } catch (err) {
      this.logger.error(`Analysis failed for report ${reportId}: ${(err as Error).message}`);
      await this.prisma.report.update({
        where: { id: reportId },
        data: { status: ReportStatus.FAILED, errorMessage: `Analysis failed: ${(err as Error).message}` },
      });
      throw err;
    }
  }
}
