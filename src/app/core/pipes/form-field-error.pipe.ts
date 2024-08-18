import { Pipe, PipeTransform, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'formFieldError',
  standalone: true,
})
export class FormFieldErrorPipe implements PipeTransform {
  transform(
    authForm: FormGroup,
    fieldName: string,
    maxLength: number,
    minLength: number
  ): string {
    const formControl: AbstractControl =
      authForm.get(fieldName) ?? new FormControl();

    let errors: string[] = [];

    if (formControl.touched) {
      if (formControl.hasError('required')) {
        errors.push(`${fieldName} is required`);
      }

      if (formControl.hasError('max')) {
        errors.push(`${fieldName} should be at most ${maxLength} characters`);
      }

      if (formControl.hasError('min')) {
        errors.push(`${fieldName} can be at least ${minLength} characters`);
      }

      if (formControl.hasError('email')) {
        errors.push('Invalid email format');
      }
    }

    return errors.join(', ');
  }
}
