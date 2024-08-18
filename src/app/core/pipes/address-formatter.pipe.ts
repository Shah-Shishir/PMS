import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../../models/profile.model';

@Pipe({
  name: 'addressFormatter',
  standalone: true,
})
export class AddressFormatterPipe implements PipeTransform {
  transform(address: Address): string {
    let detailAddress: string = '';

    if (address.city) {
      detailAddress = address.city;
    }

    if (address.division) {
      if (detailAddress) {
        detailAddress += ', ';
      }

      detailAddress += address.division;
    }

    if (address.state) {
      if (detailAddress) {
        detailAddress += ', ';
      }

      detailAddress += address.state;
    }

    if (address.country) {
      if (detailAddress) {
        detailAddress += ', ';
      }

      detailAddress += address.country;
    }

    if (detailAddress) {
      detailAddress = `From ${detailAddress}`;
    }

    return detailAddress;
  }
}
