import { AbstractControl, ValidationErrors } from '@angular/forms';

export function PasswordMatchValidator(
  group: AbstractControl
): ValidationErrors | null {
  const passwordValue = group.value['password'];
  const confirmPasswordValue = group.value['confirmPassword'];

  if (passwordValue) {
    if (passwordValue == confirmPasswordValue) {
      return null;
    } else {
      return { misMatchPasswords: "<li>Passwords don't match</li>" };
    }
  } else {
    if (confirmPasswordValue) {
      return { misMatchPasswords: "<li>Please insert password first</li>" };
    }
  }

  return null;
}
