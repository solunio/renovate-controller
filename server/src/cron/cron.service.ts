import {
    Injectable,
    Logger,
    OnApplicationBootstrap,
    OnApplicationShutdown,
    HttpException,
} from '@nestjs/common';
import * as cron from 'node-cron';
import { spawn } from 'child_process';
import { CronGateway } from './cron.gateway';
import { Subscription } from 'rxjs';

@Injectable()
export class CronService
    implements OnApplicationBootstrap, OnApplicationShutdown {
    private clientConnectedSubscription = Subscription.EMPTY;

    onApplicationBootstrap() {
        this.clientConnectedSubscription = this.cronGateway.clientConnected.subscribe(
            client => {
                client.server.emit('cron-status', !!this.task);
                client.server.emit('renovate-status', this.renovateIsExecuting);
            },
        );
    }

    onApplicationShutdown() {
        this.clientConnectedSubscription.unsubscribe();
    }

    private readonly cronLogger = new Logger('Cron');
    private readonly renovateLogger = new Logger('Renovate');

    private renovateIsExecuting: boolean = false;

    private task: cron.ScheduledTask | null;

    constructor(private readonly cronGateway: CronGateway) {}

    startCronJob(cronTime: string): void {
        if (!this.task) {
            this.cronLogger.log('Creating');
            this.cronGateway.sendBool('cron-status', true);
            try {
                this.task = cron.schedule(cronTime, () => {
                    if (!this.renovateIsExecuting) {
                        this.changeRenovateStatus(true);
                        this.cronLogger.log('Excuting');
                        const spawnEvent = spawn('renovate', {
                            cwd: '/home/renovate',
                        });
                        spawnEvent.stdout.on('data', data => {
                            this.cronGateway.sendString(
                                'renovate-output',
                                data.toString(),
                            );
                            this.renovateLogger.log(data.toString());
                        });
                        spawnEvent.stderr.on('data', err => {
                            this.cronGateway.sendString(
                                'renovate-output',
                                err.toString(),
                            );
                            this.renovateLogger.error(err.toString());
                        });
                        spawnEvent.on('error', err => {
                            this.cronGateway.sendString(
                                'renovate-output',
                                err.toString(),
                            );
                            this.renovateLogger.error(err.toString());
                            spawnEvent.kill();
                            this.renovateLogger.error('Exited');
                            this.cronLogger.log('Executed');
                            this.changeRenovateStatus(false);
                        });
                        spawnEvent.on('exit', code => {
                            if (code !== 0) {
                                this.renovateLogger.error(
                                    'Exited with code ' + code,
                                );
                            } else {
                                this.renovateLogger.log('Finished');
                            }
                            this.cronLogger.log('Executed');
                            this.changeRenovateStatus(false);
                        });
                    }
                });
                this.cronLogger.log('Created');
            } catch (err) {
                this.cronGateway.sendBool('cron-status', false);
                this.task.stop();
                this.task.destroy();
                this.cronLogger.error('An error occured while creating the cron job: \n' + err);
            }
        }
    }

    stopCronJob(): void {
        if (this.task) {
            this.cronLogger.log('Stopping');
            this.task.stop();
            this.task.destroy();
            this.task = null;
            this.cronLogger.log('Stopped');
            this.cronGateway.sendBool('cron-status', false);
        }
    }

    private changeRenovateStatus(status: boolean) {
        this.cronGateway.sendBool('renovate-status', status);
        this.renovateIsExecuting = status;
    }
}
