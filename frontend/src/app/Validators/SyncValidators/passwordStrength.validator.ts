// Cretae an custome validation for the password Strength which will check for the one small letter , one capital letter and the one special character, one digit  and the length of the password should be greater than 8. If it passwoed is not valid then it will return the error message.

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordStrength(): ValidatorFn{
    return function checkPasswordStrength(form: AbstractControl): ValidationErrors | null {
        if(form.get('password')?.value != null)
        {
            let password = form.get('password')?.value;
            let hasNumber = /\d/.test(password);
            let hasUpper = /[A-Z]/.test(password);
            let hasLower = /[a-z]/.test(password);
            let hasSpecial = /[!@#$%^&*(),.?":{}|<>]/g.test(password);
            if(hasNumber && hasUpper && hasLower && hasSpecial)
            {
                return null;
            }
            else
            {
                return {passwordStrength: true}
            }
        }
        return null;
    }
}