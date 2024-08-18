import { Pipe, PipeTransform, inject } from '@angular/core';

// Services
import { AppService } from '../services/app.service';

@Pipe({
  name: 'timeDiffText',
  standalone: true,
  pure: false,
})
export class TimeDifferenceTextPipe implements PipeTransform {
  appService = inject(AppService);

  transform(createdAt: string): string {
    const msCount = this.getDifferenceInMS(createdAt);
    const dayText = this.prepareTimeText(createdAt, msCount);
    return dayText;
  }

  getDifferenceInMS(createdAt: string): number {
    return Math.abs(new Date(createdAt).getTime() - new Date().getTime());
  }

  prepareTimeText(createdAt: string, ms: number): string {
    let text: string = '';

    const MS_PER_SECOND = 1000;
    const MS_PER_MINUTE = 1000 * 60;
    const MS_PER_HOUR = 1000 * 60 * 60;
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
    const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 7 * 30;

    if (ms < MS_PER_MINUTE) {
      text = 'Just now';
    } else if (ms >= MS_PER_SECOND && ms < MS_PER_HOUR) {
      text = Math.floor(ms / MS_PER_MINUTE) + 'm';
    } else if (ms >= MS_PER_HOUR && ms < MS_PER_DAY) {
      text = Math.floor(ms / MS_PER_HOUR) + 'h';
    } else if (ms >= MS_PER_DAY && ms < MS_PER_WEEK) {
      text = Math.floor(ms / MS_PER_DAY) + 'd';
    } else if (ms >= MS_PER_WEEK && ms < MS_PER_MONTH) {
      text = Math.floor(ms / MS_PER_WEEK) + 'w';
    } else {
      text = this.appService.parseToTimeDetails(createdAt);
    }

    return text;
  }
}
