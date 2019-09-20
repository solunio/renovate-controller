import { Component, Inject, SecurityContext } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

export interface TooltipInterface {
    link: string;
}

@Component({
    selector: 'app-config-editor-tooltip-dialog',
    templateUrl: 'tooltip-dialog.component.html'
})
export class TooltipDialogComponent {

    public tooltipLink: SafeResourceUrl;

    constructor(
        public dialogRef: MatDialogRef<TooltipDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: TooltipInterface,
        private readonly domSanitizer: DomSanitizer
    ) {
        this.tooltipLink = this.domSanitizer.bypassSecurityTrustResourceUrl(data.link);
    }

    onNoClick() {
        this.dialogRef.close();
    }

}
