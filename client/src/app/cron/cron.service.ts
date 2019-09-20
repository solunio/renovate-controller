import { Injectable } from '@angular/core';
import { SocketIOService } from '../socket-io/socket-io.service';

@Injectable()
export class CronService {

    constructor(
        private socket: SocketIOService
    ) {
    }

    connectWebSocket() {
        this.socket.connect();
    }

    disconnectWebSocket() {
        this.socket.disconnect();
    }

    getRenovateOutput() {
        return this.socket.fromEvent('renovate-output');
    }

    getCronStatus() {
        return this.socket.fromEvent('cron-status');
    }

    getRenovateStatus() {
        return this.socket.fromEvent('renovate-status');
    }

}
