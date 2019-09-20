import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { CronGateway } from './cron.gateway';

@Module({
    providers: [CronService, CronGateway],
    controllers: [CronController],
})
export class CronModule {}
