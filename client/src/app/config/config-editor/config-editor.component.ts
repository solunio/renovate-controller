import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewEncapsulation } from '@angular/core';

import { ConfigService, Config } from '../config.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TooltipDialogComponent } from '../../tooltip-dialog/tooltip-dialog.component';

@Component({
    selector: 'app-config-editor',
    templateUrl: './config-editor.component.html',
    styleUrls: ['./config-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConfigEditorComponent implements OnInit, OnDestroy {

    public config: any;
    public disabled: boolean;
    private configSubscriptions: Subscription[] = [];
    public isLoading = true;

    constructor(
        private readonly configService: ConfigService,
        private readonly snackBar: MatSnackBar,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly dialog: MatDialog
    ) { }

    ngOnInit() {
        this.loadConfig();
    }

    ngOnDestroy() {
        this.configSubscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    openDialog(configurationType: string, tooltipSelector: string): void {
        this.dialog.open(TooltipDialogComponent, {
            width: '80%',
            height: '80%',
            maxHeight: '750px',
            data: {link: `https://docs.renovatebot.com/${configurationType}/#${tooltipSelector.toLowerCase()}`}
        });
    }

    saveConfig() {
        this.configSubscriptions.push(
            this.configService.saveConfig(this.config).subscribe(
                () => {this.snackBar.open('Config has been saved successully.', null, {duration: 2000}); },
                (err) => this.snackBar.open(err, null, {duration: 10000, panelClass: ['error-snack-bar']})
            )
        );
    }

    reloadConfig() {
        this.isLoading = true;
        this.changeDetectorRef.markForCheck();
        this.loadConfig();
    }

    loadConfig() {
        this.configSubscriptions.push(
            this.configService.getConfig().subscribe(
                (config: Config) => {
                        this.config = config;
                        this.isLoading = false;
                        this.changeDetectorRef.markForCheck();
                    },
                (err) => {
                    this.snackBar.open(JSON.stringify(err), null, {duration: 10000, panelClass: ['error-snack-bar']});
                    this.isLoading = false;
                    this.changeDetectorRef.markForCheck();
                }
            )
        );
    }
}
