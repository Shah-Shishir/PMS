import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';
import { AppLoaderComponent } from '../../core/components/app-loader/app-loader.component';
import { ImagePlaceholderComponent } from '../../core/components/image-placeholder/image-placeholder.component';

// Services
import { AppService } from '../../core/services/app.service';
import { ProfileService } from '../../services/profile.service';

// Enums
import { PageType } from '../../utils/enums/page-type.enum';

// Pipes
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderComponent,
    AppLoaderComponent,
    ImagePlaceholderComponent,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.scss',
})
export class ProfilesComponent {
  pageTypes = PageType;

  appService = inject(AppService);
  profileService = inject(ProfileService);

  ngOnInit() {
    this.profileService.getProfilesFriends();
  }
}
