import { AbstractControl, ValidationErrors } from '@angular/forms';

// Moment.JS
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

export function MinimumAgeValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  // Parse the control value as a moment object
  const birthDate = moment(value);

  // Calculate the age
  const age = moment().diff(birthDate, 'years');

  // Check if age is less than the minimum age
  return age >= 18 ? null : { invalidAge: true };
}
