import {
    Controller,
    Post,
    Body,
    Get,
    Header,
    Dependencies,
} from '@nestjs/common';
import { CronService } from './cron.service';
import { Observable } from 'rxjs';

@Controller()
@Dependencies(CronService)
export class CronController {
    constructor(private readonly cronService: CronService) {}

    @Post('start')
    startCronJob(@Body('cronTime') cronTime: string): void {
        this.cronService.startCronJob(cronTime);
    }

    @Post('stop')
    stopCronJob(): void {
        this.cronService.stopCronJob();
    }
}
