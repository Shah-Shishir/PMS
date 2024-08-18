import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'privacyIcon',
  standalone: true,
})
export class PrivacyIconPipe implements PipeTransform {
  transform(privacyId: number): string {
    if (privacyId == 1) {
      return 'public';
    } else if (privacyId == 2) {
      return 'group';
    } else {
      return 'lock';
    }
  }
}
