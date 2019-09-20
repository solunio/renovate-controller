import {AbstractControl, FormArray} from '@angular/forms';


// TODO: remove as soon as https://github.com/angular/angular/pull/27222 is merged
export class EnhancedFormArray extends FormArray {

    /**
     * Move a control from one position to another. The controls
     * in between move one position towards the moved controls
     * origin.
     *
     * @usageNotes
     * ### Move a control inside of a FormArray
     *
     * ```typescript
     * const arr = new FormArray([
     *   new FormControl(0),
     *   new FormControl(1),
     *   new FormControl(2)
     * ]);
     *
     * arr.moveControl(0, 2);
     * console.log(arr.value);   // [1, 2, 0]
     * ```
     *
     * This can be used with Material CDK drag and drop. See its
     * docs here: https://material.angular.io/cdk/drag-drop/overview
     *
     * @param from Index of the array item to move
     * @param to Index of the target item position
     */
    public moveControl(from: number, to: number): void {
        (this as any)._throwIfControlMissing(from);
        (this as any)._throwIfControlMissing(to);

        if (from === to) {
            return;
        }

        this.controls.splice(to, 0, this.controls.splice(from, 1)[0]);

        this.updateValueAndValidity();
        (this as any)._onCollectionChange();
    }

    /**
     * Replace the current controls with new ones.
     *
     * @usageNotes
     * ### Replace controls of a FormArray
     *
     * ```typescript
     * const arr = new FormArray([
     *   new FormControl(0),
     *   new FormControl(1),
     *   new FormControl(2)
     * ]);
     *
     * console.log(arr.value);   // [1, 2, 0]
     *
     * arr.replaceControls([new FormControl(2)]);
     *
     * console.log(arr.value);   // [2]
     * ```
     *
     * @param controls The new controls which will replace the old ones
     */
    public replaceControls(controls: AbstractControl[]): void {
        if (this.controls.length) {
            this.controls.forEach(control => (control as any)._registerOnCollectionChange(() => undefined));
            this.controls.splice(0);
        }

        controls.forEach(control => {
            this.controls.push(control);
            (this as any)._registerControl(control);
        });

        this.updateValueAndValidity();
        (this as any)._onCollectionChange();
    }
}
