import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export type Config = any;

@Injectable()
export class ConfigService {

    constructor(
        private readonly httpClient: HttpClient
    ) {

    }

    getConfig(): Observable<Config> {
        return this.httpClient.get('/api/config');
    }

    saveConfig(config: Config): Observable<void> {
        return this.httpClient.put<void>('/api/config', config);
    }

}
