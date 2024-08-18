import { AbstractControl, ValidationErrors } from '@angular/forms';

export function PasswordStrengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value: string = control.value;

  if (!value) {
    return null;
  }

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumeric = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const isInvalid =
    !hasUpperCase || !hasLowerCase || !hasNumeric || !hasSpecial;
  const isAllInvalid =
    !hasUpperCase && !hasLowerCase && !hasNumeric && !hasSpecial;
  const errors: string[] = [];

  if (isAllInvalid) {
    errors.push(
      '<li>Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character</li>'
    );
  }

  if (!hasUpperCase) {
    errors.push(
      '<li>Password must contain at least one uppercase letter (A-Z)</li>'
    );
  }

  if (!hasLowerCase) {
    errors.push(
      '<li>Password must contain at least one lowercase letter (a-z)</li>'
    );
  }

  if (!hasNumeric) {
    errors.push('<li>Password must contain at least one digit (0-9)</li>');
  }

  if (!hasSpecial) {
    errors.push(
      '<li>Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)</li>'
    );
  }

  if (isInvalid) {
    return {
      passwordStrength: errors,
    };
  }

  return null;
}
