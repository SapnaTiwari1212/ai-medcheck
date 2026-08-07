import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorName = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null) {
        const { message: m, error: e } = body as { message?: string | string[]; error?: string };
        message = m ?? exception.message;
        errorName = e ?? HttpStatus[status];
      }
    } else if (exception instanceof Error) {
      errorName = exception.name;
      message = exception.message;
      this.logger.error(
        `Unhandled error on ${request.method} ${request.originalUrl}: ${exception.stack ?? exception.message}`,
      );
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Internal error on ${request.method} ${request.originalUrl}`);
    }

    const body: ErrorResponse = {
      statusCode: status,
      message,
      ...(status >= 500 ? {} : { error: errorName }),
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    };

    response.status(status).json(body);
  }
}
