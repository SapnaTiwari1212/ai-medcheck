import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(config: ConfigService) {
    const url = config.get<string>('REDIS_URL')!;
    const enableTls = config.get<boolean>('REDIS_TLS') === true;
    super(
      url.startsWith('rediss://') || (enableTls && url.startsWith('redis://'))
        ? url.replace('redis://', 'rediss://')
        : url,
      {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        lazyConnect: true,
      },
    );
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.connect();
      this.logger.log('Connected to Redis');
    } catch (err) {
      this.logger.warn(`Redis connection failed: ${(err as Error).message}`);
    }
  }

  async ping(): Promise<'PONG'> {
    if (this.status !== 'ready') {
      throw new Error(`Redis is not connected (status: ${this.status})`);
    }
    return super.ping();
  }

  async onModuleDestroy(): Promise<void> {
    await this.quit();
  }
}
