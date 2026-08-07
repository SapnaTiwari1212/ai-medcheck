import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RedisService } from '../redis/redis.service';
import { ANALYSIS_QUEUE, OCR_QUEUE } from './queue.constants';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [RedisService],
      useFactory: (redis: RedisService) => ({
        connection: redis,
      }),
    }),
    BullModule.registerQueue({ name: OCR_QUEUE }),
    BullModule.registerQueue({ name: ANALYSIS_QUEUE }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
