import {AbstractControl} from '@angular/forms';

import {AbstractControlValueAccessorValidatorComponent} from './abstract-control-value-accessor-validator.component';
import {EnhancedFormArray} from './enhanced-form-array';


export abstract class AbstractArrayControlValueAccessorValidatorComponent<TValue, TControl extends EnhancedFormArray>
    extends AbstractControlValueAccessorValidatorComponent<TValue[], TControl> {

    protected resetControl(value: TValue[]): void {
        const changes = Array.isArray(value) ? value : [];
        this.control.replaceControls(changes.map(item => this.buildArrayItemControl(item)));
    }

    protected abstract buildArrayItemControl(item: TValue): AbstractControl;
}
