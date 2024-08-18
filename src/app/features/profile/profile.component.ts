import { Component, inject } from '@angular/core';

// Components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';
import { AppLoaderComponent } from '../../core/components/app-loader/app-loader.component';
import { CoverPhotoSectionComponent } from './cover-photo-section/cover-photo-section.component';
import { InfoWithFeedsComponent } from './info-with-feeds/info-with-feeds.component';
import { NameSectionComponent } from './name-section/name-section.component';

// Services
import { ProfileService } from '../../services/profile.service';

// Utils
import { PageType } from '../../utils/enums/page-type.enum';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [
    AppHeaderComponent,
    AppLoaderComponent,
    CoverPhotoSectionComponent,
    InfoWithFeedsComponent,
    NameSectionComponent,
  ],
})
export class ProfileComponent {
  profileService = inject(ProfileService);
  pageTypes = PageType;
}
