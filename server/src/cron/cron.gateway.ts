import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Client } from 'socket.io';
import { Subject } from 'rxjs';

@WebSocketGateway()
export class CronGateway implements OnGatewayConnection {
    public readonly clientConnected = new Subject<Client>();

    handleConnection(client: Client) {
        this.clientConnected.next(client);
    }

    @WebSocketServer()
    server: Server;

    sendString(event: string, data: string) {
        this.server.emit(event, data);
    }

    sendBool(event: string, status: boolean) {
        this.server.emit(event, status);
    }

    // https://www.joshmorony.com/creating-a-simple-live-chat-server-with-nestjs-websockets/
}
