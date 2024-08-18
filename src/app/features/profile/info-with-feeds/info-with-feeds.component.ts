import { Component, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { AppDatepickerComponent } from '../../../core/components/app-datepicker/app-datepicker.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { FeedFormComponent } from './feed-form/feed-form.component';
import { FeedListComponent } from './feed-list/feed-list.component';

// Services
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';

// Pipes
import { DatePipe } from '@angular/common';

@Component({
  selector: 'profile-info-with-feeds',
  standalone: true,
  imports: [
    ProfileInfoComponent,
    FeedFormComponent,
    FeedListComponent,
    AppDatepickerComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe,
  ],
  templateUrl: './info-with-feeds.component.html',
  styleUrl: './info-with-feeds.component.scss',
})
export class InfoWithFeedsComponent {
  authService = inject(AuthService);
  profileService = inject(ProfileService);
}
