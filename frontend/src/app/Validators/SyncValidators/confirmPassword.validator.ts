import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function confirmPasswordMatch(): ValidatorFn{
    return function confirmPassword(form: AbstractControl): ValidationErrors | null {
        if(form.get('password')?.value != form.get('confirmPassword')?.value)
        {
            return {confirmPassword: true}
        }
        return null;
    }
}