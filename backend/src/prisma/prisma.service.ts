import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly nodeEnv: string;

  constructor(config: ConfigService) {
    super();
    this.nodeEnv = config.get<string>('NODE_ENV') ?? 'development';
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Connected to PostgreSQL');
    } catch (err) {
      const message = (err as Error).message;
      if (this.nodeEnv === 'production') {
        this.logger.error(`Failed to connect to PostgreSQL: ${message}`);
        throw err;
      }
      this.logger.warn(
        `PostgreSQL unreachable (${message}). API will boot but database operations will fail until DATABASE_URL is reachable.`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Disconnected from PostgreSQL');
  }
}
