import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AppConstant } from '../constants/app-constant';

export function MinLengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  return (control.value || '').trim().length >=
    AppConstant.DISPLAY_NAME_MINLENGTH
    ? null
    : {
        minlength: {
          requiredLength: AppConstant.DISPLAY_NAME_MINLENGTH,
        },
      };
}
