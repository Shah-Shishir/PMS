import { AbstractControl, ValidationErrors } from '@angular/forms';

export function HasExtraSpaceValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value: string = control.value;

  if (!value) {
    return null;
  }

  return value.includes(' ') ? { hasExtraSpace: true } : null;
}
