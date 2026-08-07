import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { OcrProcessor } from './reports.processor';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, OcrProcessor],
  exports: [ReportsService],
})
export class ReportsModule {}
