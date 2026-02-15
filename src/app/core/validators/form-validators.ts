import { AbstractControl, ValidationErrors } from "@angular/forms";

export function trimmedRequired(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return { required: true };

    const value = control.value.trim();

    if (value.length === 0) {
        return { required: true };
    }

    return null;
}