import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { FieldType } from '../../utils/enums/field-type.enum';

@Pipe({
  name: 'inputType',
  standalone: true,
})
export class InputTypePipe implements PipeTransform {
  transform(fieldType: string): string {
    let inputType!: string;

    if (fieldType == FieldType.TEXT) {
      inputType = 'text';
    } else if (fieldType == FieldType.EMAIL) {
      inputType = 'email';
    } else if (fieldType == FieldType.PASSWORD) {
      inputType = 'password';
    }

    return inputType;
  }
}
