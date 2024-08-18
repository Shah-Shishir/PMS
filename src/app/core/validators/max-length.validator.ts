import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AppConstant } from '../constants/app-constant';

export function MaxLengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  return (control.value || '').trim().length <=
    AppConstant.DISPLAY_NAME_MAXLENGTH
    ? null
    : {
        maxlength: {
          requiredLength: AppConstant.DISPLAY_NAME_MAXLENGTH,
        },
      };
}
