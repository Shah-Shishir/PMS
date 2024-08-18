import { Component, inject, input } from '@angular/core';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { ConfirmDeleteDialogComponent } from '../../../core/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ImageViewerComponent } from '../../../core/components/image-viewer/image-viewer.component';
import { WebcamDialogComponent } from '../webcam-dialog/webcam-dialog.component';

// Services
import { ProfileService } from '../../../services/profile.service';
import { UiService } from '../../../core/services/ui.service';

// Enums
import { PictureOption } from '../../../utils/enums/picture-option.enum';

@Component({
  selector: 'profile-photo-actions',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './photo-actions.component.html',
  styleUrl: './photo-actions.component.scss',
})
export class PhotoActionsComponent {
  option = input.required<string>();

  options = PictureOption;

  tooltipText: string = '';

  profileService = inject(ProfileService);
  uiService = inject(UiService);

  ngOnInit() {
    this.tooltipText =
      this.option() == this.options.PROFILE_PHOTO
        ? 'Profile Photo'
        : 'Cover Photo';
  }

  viewPhoto() {
    this.uiService.openDialog(ImageViewerComponent, {
      url:
        this.option() == this.options.PROFILE_PHOTO
          ? this.profileService.profile.photoURL
          : this.profileService.profile.coverPhotoURL,
    });
  }

  openWebcamDialog() {
    this.uiService.openDialog(WebcamDialogComponent, {
      profile: this.profileService.profile,
      option: this.option(),
    });
  }

  openConfirmPictureDeletionDialog() {
    this.uiService.openDialog(ConfirmDeleteDialogComponent, {
      deleteText:
        this.option() == this.options.PROFILE_PHOTO
          ? 'this profile picture'
          : 'this cover photo',
    });

    this.uiService.dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (this.option() == this.options.PROFILE_PHOTO) {
          this.profileService.deleteProfilePhoto(
            this.profileService.profile.uid,
            this.profileService.profile.photoName!
          );
        } else {
          this.profileService.deleteCoverPhoto(
            this.profileService.profile.uid,
            this.profileService.profile.coverPhotoName!
          );
        }
      }
    });
  }
}
