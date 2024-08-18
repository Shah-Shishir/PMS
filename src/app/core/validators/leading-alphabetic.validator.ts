import { AbstractControl, ValidationErrors } from '@angular/forms';

export function LeadingAlphabeticValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const firstCharacter: string = value[0];

  if (
    (firstCharacter >= 'A' && firstCharacter <= 'Z') ||
    (firstCharacter >= 'a' && firstCharacter <= 'z')
  ) {
    return null;
  }

  return { noLeadingAlphabetic: true };
}
