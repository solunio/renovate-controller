import { Controller, Get, Header, Put, Body } from '@nestjs/common';

import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
    constructor(private readonly configService: ConfigService) {}
    @Get()
    @Header('content-type', 'application/json')
    getConfig(): string {
        return this.configService.getConfig();
    }
    @Put()
    saveConfig(@Body() config): void {
        this.configService.saveConfig(config);
    }
}
