import { Controller, Get, Res } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorService,
  ServiceUnavailableException,
} from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@ApiTags('Health')
@Public()
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly indicator: HealthIndicatorService,
    private readonly prisma: PrismaService,
    private readonly redisClient: RedisService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check for the API, database and Redis' })
  async check(@Res({ passthrough: true }) res: Response) {
    try {
      return await this.health.check([
        async () => {
          const database = this.indicator.check('database');
          try {
            await this.prisma.$queryRaw`SELECT 1`;
            return database.up();
          } catch (err) {
            return database.down({ message: (err as Error).message });
          }
        },
        async () => {
          const redis = this.indicator.check('redis');
          try {
            await this.redisClient.ping();
            return redis.up();
          } catch (err) {
            return redis.down({ message: (err as Error).message });
          }
        },
      ]);
    } catch (err) {
      if (err instanceof ServiceUnavailableException) {
        res.status(err.getStatus());
        return err.getResponse();
      }
      throw err;
    }
  }
}
