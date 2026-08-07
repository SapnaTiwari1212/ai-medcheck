import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalysisResult, Report } from '@prisma/client';
import { memoryStorage } from 'multer';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthUser } from '../common/types/auth.types';
import { ListReportsQueryDto } from './dto/list-reports.dto';
import { MAX_UPLOAD_BYTES } from './file-validation.util';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload a medical report (PDF, JPG, PNG — max 25 MB)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_UPLOAD_BYTES },
    }),
  )
  async upload(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Report> {
    if (!file) throw new BadRequestException('No file was uploaded');
    return this.reports.upload(user.id, file);
  }

  @Get()
  @ApiOperation({ summary: 'List the current user reports' })
  list(
    @CurrentUser() user: AuthUser,
    @Query() query: ListReportsQueryDto,
  ): Promise<PaginatedResult<Report>> {
    return this.reports.list(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by id' })
  get(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<Report> {
    return this.reports.findById(user.id, id);
  }

  @Get(':id/text')
  @ApiOperation({ summary: 'Get the extracted OCR text of a report' })
  getText(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.reports.getText(user.id, id);
  }

  @Get(':id/analysis')
  @ApiOperation({ summary: 'Get the AI analysis result for a report' })
  getAnalysis(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<AnalysisResult | null> {
    return this.reports.getAnalysis(user.id, id);
  }

  @Post(':id/analyze')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Trigger (or re-trigger) AI analysis for a report' })
  requestAnalysis(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<Report> {
    return this.reports.requestAnalysis(user.id, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a report and its stored file' })
  async delete(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<{ message: string }> {
    await this.reports.delete(user.id, id);
    return { message: 'Report deleted successfully' };
  }
}
