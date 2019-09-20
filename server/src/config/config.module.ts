import { Module, DynamicModule } from '@nestjs/common';

import {
    ConfigService,
    AppConfiguration,
    APP_CONFIGURATION,
} from './config.service';
import { ConfigController } from './config.controller';

@Module({
    providers: [ConfigService],
    controllers: [ConfigController],
})
export class ConfigModule {
    public static forRoot(config: AppConfiguration): DynamicModule {
        return {
            module: ConfigModule,
            providers: [{ provide: APP_CONFIGURATION, useValue: config }],
        };
    }
}
