import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { join } from 'path';
import { AppModule } from './app.module';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const config = app.get(ConfigService);
  const apiPrefix = config.get<string>('apiPrefix') ?? 'api';
  const clientUrl = config.get<string>('clientUrl') ?? 'http://localhost:5173';

  app.setGlobalPrefix(apiPrefix);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  const storageProvider = config.get<string>('storage.provider');
  if (storageProvider === 'local') {
    const storagePath = config.get<string>('storage.localStoragePath') ?? './storage/uploads';
    app.use(
      '/uploads',
      express.static(join(process.cwd(), storagePath), { fallthrough: true, maxAge: '1h' }),
    );
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AI MedCheck API')
    .setDescription(
      'Educational medical report analysis platform. Upload a lab report, extract text with OCR, and receive AI-powered educational insights. This API provides educational information only and never diagnoses or prescribes.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' },
      'access-token',
    )
    .addCookieAuth('access_token')
    .addTag('Authentication', 'Registration, login, session and password management')
    .addTag('Users', 'Current user profile management')
    .addTag('Reports', 'Medical report upload and management')
    .addTag('Health', 'Service health checks')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  return app;
}

async function bootstrap() {
  const app = await createApp();
  const config = app.get(ConfigService);
  const port = config.get<number>('port') ?? 4000;
  const apiPrefix = config.get<string>('apiPrefix') ?? 'api';

  await app.listen(port);
  app.get(Logger).log(`AI MedCheck API running on http://localhost:${port}/${apiPrefix}`);
  app.get(Logger).log(`Swagger documentation on http://localhost:${port}/api/docs`);
}

void bootstrap();
