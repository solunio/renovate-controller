import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { CronModule } from './cron/cron.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'client', 'dist'),
        }),
        ConfigModule.forRoot({ configPath: process.env.CONFIG_PATH }),
        CronModule,
    ],
})
export class AppModule {}
