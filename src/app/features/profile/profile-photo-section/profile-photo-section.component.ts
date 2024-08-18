import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { AppLoaderComponent } from '../../../core/components/app-loader/app-loader.component';
import { PhotoActionsComponent } from '../photo-actions/photo-actions.component';

// Services
import { ProfileService } from '../../../services/profile.service';

// Enums
import { PictureOption } from '../../../utils/enums/picture-option.enum';

@Component({
  selector: 'app-profile-photo-section',
  standalone: true,
  imports: [
    CommonModule,
    AppLoaderComponent,
    PhotoActionsComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile-photo-section.component.html',
  styleUrl: './profile-photo-section.component.scss',
})
export class ProfilePhotoSectionComponent {
  profileService = inject(ProfileService);
  pictureOptions = PictureOption;
}
