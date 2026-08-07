import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from '../app.module';

/**
 * Standalone worker process entrypoint.
 * Boots the full application context (modules, processors, queues)
 * without starting the HTTP server.
 */
async function bootstrapWorker() {
  const app = await NestFactory.createApplicationContext(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  const logger = app.get(Logger);
  logger.log('BullMQ worker running — processing OCR and analysis jobs');
}

void bootstrapWorker();
