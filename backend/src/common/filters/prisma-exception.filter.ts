import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const mapping: Record<string, { status: HttpStatus; message: string }> = {
      P2002: { status: HttpStatus.CONFLICT, message: 'A record with this value already exists' },
      P2025: { status: HttpStatus.NOT_FOUND, message: 'The requested record was not found' },
      P2003: { status: HttpStatus.BAD_REQUEST, message: 'Related record constraint failed' },
    };

    const mapped = mapping[exception.code];
    const status = mapped?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = mapped?.message ?? 'Database operation failed';

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Prisma error ${exception.code}: ${exception.message}`);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
      ...(exception.meta && status < 500 ? { details: exception.meta } : {}),
      timestamp: new Date().toISOString(),
    });
  }
}
