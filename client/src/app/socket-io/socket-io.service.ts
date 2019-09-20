import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import {connect} from 'socket.io-client';

export class SocketIOService {

    ioSocket: SocketIOClient.Socket;

    constructor() {
        this.ioSocket = connect( `${window.location.protocol}//${window.location.hostname}:${window.location.port}`);
    }
    connect() {
        return this.ioSocket.connect();
    }

    disconnect(close?: any) {
        return this.ioSocket.disconnect.apply(this.ioSocket, arguments);
    }

    fromEvent<T>(eventName: string): Observable<T> {
        return new Observable<T>( observer => {
            const emitEvent =  (data: T) => observer.next(data);

            this.ioSocket.on(eventName, emitEvent);

            return () => this.ioSocket.removeListener(eventName, emitEvent);
        }).pipe(
            share()
        );
    }

}
