import { Injectable } from '@angular/core';

// Routing
import { ActivatedRoute } from '@angular/router';

// Moment
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  _appDB: any;

  get userId(): string {
    return localStorage.getItem('userId') ?? '';
  }

  getRouteParamData(route: ActivatedRoute, paramName: string) {
    return route.snapshot.paramMap.get(paramName) ?? this.userId;
  }

  static redirectToRoute(): string {
    const token: String = localStorage.getItem('token') ?? '';
    return token ? '/profile' : '/auth';
  }

  formatMomentDate(dateValue: string) {
    if (!dateValue) {
      return null;
    }

    const date = moment(dateValue).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    return date === 'Invalid date' ? null : date;
  }

  returnCopy(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  parseToTimeDetails(isoDate: string): string {
    const date = new Date(isoDate);

    // Options for the date part
    const dateOptions = {
      weekday: 'long' as any, // "Monday"
      year: 'numeric' as any, // "2015"
      month: 'long' as any, // "June"
      day: 'numeric' as any, // "15"
    };

    // Options for the time part
    const timeOptions = {
      hour: 'numeric' as any, // "9"
      minute: 'numeric' as any, // "03"
      second: 'numeric' as any, // "01"
      hour12: true, // "at 9:03:01"
    };

    // Get the formatted date string
    const dateString = date.toLocaleDateString('en-US', dateOptions);

    // Get the formatted time string
    const timeString = date.toLocaleTimeString('en-US', timeOptions);

    // Combine the date and time parts
    const formattedDate = `${dateString} at ${timeString}`;

    return formattedDate;
  }
}
