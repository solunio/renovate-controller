import { Injectable, Inject } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';

export const APP_CONFIGURATION = 'APP_CONFIGURATION';

export interface AppConfiguration {
    configPath: string;
}

@Injectable()
export class ConfigService {
    constructor(
        @Inject(APP_CONFIGURATION)
        private readonly appConfiguration: AppConfiguration,
    ) {}

    getConfig(): string {
        return readFileSync(this.appConfiguration.configPath, {
            encoding: 'utf8',
        });
    }

    saveConfig(config: any): void {
        if (config.force.forceEnabled) {
            config.force = {
                forceEnabled: config.force.forceEnabled,
                ...config.onboardingConfig,
            };
        } else {
            config.force = { forceEnabled: config.force.forceEnabled };
        }
        writeFileSync(
            this.appConfiguration.configPath,
            JSON.stringify(config, null, 4),
        );
    }
}
