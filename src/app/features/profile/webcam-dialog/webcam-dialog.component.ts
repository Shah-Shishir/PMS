import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Models
import { Profile } from '../../../models/profile.model';

// Services
import { ProfileService } from '../../../services/profile.service';
import { WebcamService } from '../../../services/webcam.service';

// Webcam
import { WebcamModule } from 'ngx-webcam';

// Image Cropper
import { ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'profile-webcam-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    WebcamModule,
    ImageCropperComponent,
  ],
  templateUrl: './webcam-dialog.component.html',
  styleUrl: './webcam-dialog.component.scss',
})
export class WebcamDialogComponent {
  profileService = inject(ProfileService);
  service = inject(WebcamService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { profile: Profile; option: string }
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.service.showWebCamOptions = true;
    }, 1500);
  }
}
