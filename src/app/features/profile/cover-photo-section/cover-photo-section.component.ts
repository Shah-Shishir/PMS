import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { PhotoActionsComponent } from '../photo-actions/photo-actions.component';
import { PhotoUploadOptionsComponent } from '../photo-upload-options/photo-upload-options.component';
import { ProfilePhotoSectionComponent } from '../profile-photo-section/profile-photo-section.component';

// Services
import { ProfileService } from '../../../services/profile.service';

// Enums
import { PictureOption } from '../../../utils/enums/picture-option.enum';

@Component({
  selector: 'profile-cover-photo-section',
  standalone: true,
  imports: [
    CommonModule,
    PhotoActionsComponent,
    PhotoUploadOptionsComponent,
    ProfilePhotoSectionComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './cover-photo-section.component.html',
  styleUrl: './cover-photo-section.component.scss',
})
export class CoverPhotoSectionComponent {
  profileService = inject(ProfileService);

  pictureOptions = PictureOption;
}
