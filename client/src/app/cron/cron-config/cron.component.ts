import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubscriptionManager } from 'src/app/utils/subscription-manager';
import { MatDialog } from '@angular/material/dialog';
import { TooltipDialogComponent } from 'src/app/tooltip-dialog/tooltip-dialog.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SocketIOService } from 'src/app/socket-io/socket-io.service';

@Component({
    selector: 'app-cron',
    templateUrl: './cron.component.html',
    styleUrls: ['./cron.component.scss'],
    providers: [
        Location,
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CronComponent implements OnInit, OnDestroy {

    public readonly cronTooltip: string = `* * * * * ===> \n
            Day of week (0–7) (Sunday=0 or 7) or Sun, Mon, Tue,… ||| \n
            Month (1–12) or Jan, Feb,… ||| \n
            Day of month (1–31) ||| \n
            Hour (0–23) ||| \n
            Minute (0–59)`;
    public cronRuns = false;
    public cronTime = '* * * * *';
    public renovateRuns = false;
    public renovateOutput = '';

    private subscriptionManager: SubscriptionManager;

    private socket: SocketIOService;

    constructor(
            private readonly httpClient: HttpClient,
            private readonly snackBar: MatSnackBar,
            private readonly changeDetectorRef: ChangeDetectorRef,
            private readonly dialog: MatDialog,
            ) {
        this.socket = new SocketIOService();
    }

    ngOnInit() {
        this.socket.connect();
        this.subscriptionManager = new SubscriptionManager();
        this.subscriptionManager.registerSubscription(
            this.socket.fromEvent('renovate-output').subscribe((data: string) => {
                this.renovateOutput += data + '\n';
                this.changeDetectorRef.markForCheck();
            })
        );
        this.subscriptionManager.registerSubscription(
            this.socket.fromEvent('cron-status').subscribe((status: boolean) => {
                this.cronRuns = status;
                this.changeDetectorRef.markForCheck();
            })
        );
        this.subscriptionManager.registerSubscription(
            this.socket.fromEvent('renovate-status').subscribe((status: boolean) => {
                if (!this.renovateRuns && status) { this.clearRenovateOutput(); }
                this.renovateRuns = status;
                this.changeDetectorRef.markForCheck();
            }
        ));
    }

    ngOnDestroy() {
        this.subscriptionManager.unsubscribeAll();
        this.socket.disconnect();
    }

    openDialog(selector: string): void {
        if (selector === 'cron') {
            this.dialog.open(TooltipDialogComponent, {
                width: '80%',
                height: '80%',
                data: {link: `https://crontab.guru`}
            });
        }
    }

    startStopCronJob() {

        if (this.cronRuns) {
            this.subscriptionManager.registerSubscription(
                this.httpClient.post('/api/stop', {})
                        .subscribe(
                            () => this.snackBar.open(`Cron job has been stopped`, null, {duration: 2000}),
                            (err) => this.snackBar.open(JSON.stringify(err, null, 4), null,
                            {duration: 10000, panelClass: ['error-snack-bar']})
                        )
            );
        } else {
            this.subscriptionManager.registerSubscription(
                this.httpClient.post('/api/start', {cronTime: this.cronTime})
                        .subscribe(
                            () => this.snackBar.open(`Cron job has been started`, null,
                                {duration: 2000, panelClass: ['started-snack-bar']}),
                            (err) => this.snackBar.open(JSON.stringify(err, null, 4), null,
                                {duration: 10000, panelClass: ['error-snack-bar']})
                        )
            );
        }

    }

    clearRenovateOutput() {
        this.renovateOutput = '';
    }

}
