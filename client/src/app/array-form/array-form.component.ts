import { Component, forwardRef, ChangeDetectorRef, Input } from '@angular/core';
import { ControlValueAccessor,
    Validator,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
    FormControl,
    Validators,
    AbstractControl,
    ValidationErrors } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';

import {
    AbstractArrayControlValueAccessorValidatorComponent
} from '../abstract-control/abstract-control-array-value-accessor-validator.component';
import { EnhancedFormArray } from '../abstract-control/enhanced-form-array';


@Component({
    selector: 'app-array-form',
    template: `
    <mat-accordion>
    <mat-expansion-panel style="margin-bottom: 2%;">
        <mat-expansion-panel-header>
        {{title}}
        </mat-expansion-panel-header>
        <button mat-icon-button (click)="addItem($event)" type="button"><mat-icon>add</mat-icon></button>
        <div  *ngFor="let control of controls; index as i">
        <mat-form-field>
        <input matInput
            [formControl]="control"
            [placeholder]="title + (i + 1)"
            required>
            <button mat-icon-button matSuffix (click)="removeItem(i)" type="button"><mat-icon>delete_sweep</mat-icon></button>
        </mat-form-field>
        </div>
    </mat-expansion-panel>
    </mat-accordion>`,
    styles: [`mat-form-field {width:100%}`],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ArrayFormComponent), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => ArrayFormComponent), multi: true}
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ArrayFormComponent extends AbstractArrayControlValueAccessorValidatorComponent<string, EnhancedFormArray> {

    @Input() title: string;

    public get controls(): FormControl[] {
        return this.control.controls as FormControl[];
    }

    constructor(changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef, new EnhancedFormArray([]));
    }

    public addItem(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        this.control.insert(0, this.buildArrayItemControl(null));
    }

    public removeItem(index: number): void {
        this.control.removeAt(index);
    }

    protected buildArrayItemControl(item: string): AbstractControl {
        return new FormControl(item, Validators.required);
    }
    public validate(control: AbstractControl): ValidationErrors | null {
        return this.control.valid ? null : {validationError: true};
    }

}
