import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormArray, FormGroup, ValidationErrors, Validator} from '@angular/forms';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';


export abstract class AbstractControlValueAccessorValidatorComponent<TValue, TControl extends AbstractControl>
    implements ControlValueAccessor, OnDestroy, Validator {

    public touched: () => void;
    public triggerValidation: () => void;

    public readonly disabled$: Observable<boolean>;

    protected pauseChanges = false;

    protected readonly userValueChanges$: Observable<TValue>;
    protected readonly destroyed = new ReplaySubject<void>(1);

    private readonly disabledSubject = new BehaviorSubject<boolean>(false);

    protected constructor(protected readonly changeDetectorRef: ChangeDetectorRef,
                          protected readonly control: TControl) {

        this.touched = () => undefined;
        this.triggerValidation = () => undefined;

        this.disabled$ = this.disabledSubject.asObservable();
        this.userValueChanges$ = this.control.valueChanges.pipe(
            filter(() => !this.pauseChanges),
            map(val => {
                if (this.control instanceof FormGroup || this.control instanceof FormArray) {
                    return this.control.getRawValue();
                } else {
                    return val;
                }
            }),
            map(val => this.transformControlValue(val))
        );
    }

    public get disabled(): boolean {
        return this.disabledSubject.value;
    }

    public set disabled(d: boolean) {
        this.disabledSubject.next(d);
    }

    public ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
    }

    public writeValue(value: TValue): void {
        this.pauseChanges = true;

        this.resetControl(value);

        this.pauseChanges = false;

        this.changeDetectorRef.markForCheck();
    }

    public abstract validate(control: AbstractControl): ValidationErrors | null;

    // NOTE: this method vas here to ensure that async validators were also reflected to the NG_VALIDATOR,
    // but `registerOnValidatorChange`also calls a `valueChange` on the parent form. Rethink the mechanism when needed
    // public registerOnValidatorChange(fn: () => void): void {
    //     this.control.statusChanges.pipe(
    //         filter(() => !this.pauseChanges),
    //         distinctUntilChanged(),
    //         takeUntil(this.destroyed)
    //     ).subscribe(fn);
    // }

    public registerOnChange(fn: (change: TValue) => void): void {
        this.userValueChanges$.pipe(
            takeUntil(this.destroyed)
        ).subscribe(
            val => fn(val)
        );
    }

    public registerOnValidatorChange(fn: () => void): void {
        this.triggerValidation = fn;
    }

    public registerOnTouched(fn: any): void {
        this.touched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {

        this.disabled = isDisabled;

        isDisabled ? this.control.disable({emitEvent: false}) : this.control.enable({emitEvent: false});

        this.changeDetectorRef.markForCheck();
    }

    protected resetControl(value: TValue): void {
        this.control.setValue(value);
    }

    protected transformControlValue(value: any): TValue {
        return value;
    }
}
