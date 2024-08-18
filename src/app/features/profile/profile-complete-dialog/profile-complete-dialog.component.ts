import { Component, Inject, inject } from '@angular/core';

// Forms
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';

// Components
import { AppInputComponent } from '../../../core/components/app-input/app-input.component';
import { AppSelectComponent } from '../../../core/components/app-select/app-select.component';
import { AppDatepickerComponent } from '../../../core/components/app-datepicker/app-datepicker.component';
import { PhotoUploadOptionsComponent } from '../photo-upload-options/photo-upload-options.component';

// Models
import { Profile } from '../../../models/profile.model';
import { FormField } from '../../../models/formField.model';

// Services
import { AuthService } from '../../../services/auth.service';
import { FormService } from '../../../core/services/form.service';
import { UiService } from '../../../core/services/ui.service';
import { ProfileService } from '../../../services/profile.service';

// Enums
import { PictureOption } from '../../../utils/enums/picture-option.enum';

@Component({
  selector: 'app-profile-complete-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    AppInputComponent,
    AppSelectComponent,
    AppDatepickerComponent,
    PhotoUploadOptionsComponent,
  ],
  templateUrl: './profile-complete-dialog.component.html',
  styleUrl: './profile-complete-dialog.component.scss',
})
export class ProfileCompleteDialogComponent {
  canSkip!: boolean;
  headerText!: string;

  authService = inject(AuthService);
  formService = inject(FormService);
  uiService = inject(UiService);
  profileService = inject(ProfileService);

  field!: FormField;
  uiID: number = 0;
  file: File | null = null;

  pictureOptions = PictureOption;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { profile: Profile }
  ) {
    this.setComponentUI();
  }

  setComponentUI() {
    const { displayName, genderId, photoURL, dob } = this.data.profile;

    this.canSkip = !!(displayName && dob);

    if (!displayName) {
      this.headerText = 'Please Add an Username';
      this.formService.prepareUsernameForm();
      this.field = {
        id: 1,
        isRequired: true,
        label: 'Username',
        minLength: 6,
        maxLength: 12,
        name: 'displayName',
      };
      this.uiID = 1;
    } else if (!genderId) {
      this.headerText = 'Please Select Your Gender';
      this.formService.prepareGenderForm();
      this.field = {
        id: 2,
        isRequired: true,
        label: 'Gender',
        name: 'genderId',
        values: [
          { id: 1, label: 'Male', name: 'male' },
          { id: 2, label: 'Female', name: 'female' },
        ],
      };
      this.uiID = 2;
    } else if (!photoURL) {
      this.headerText = 'Please Upload a Profile Picture';
      this.field = {
        id: 3,
        isRequired: false,
        label: 'Profile Picture',
        name: 'photoURL',
      };
      this.uiID = 3;
    } else if (!dob) {
      this.prepareBirthdayForm();
    }
  }

  prepareBirthdayForm() {
    this.headerText = 'Please Select Your Birthday';
    this.formService.prepareBirthdayForm(this.profileService.profile.dob!);
    this.field = {
      id: 4,
      isRequired: false,
      label: 'Date of Birth',
      name: 'dob',
    };
    this.uiID = 4;
  }

  skipSection() {
    if (this.uiID == 3) {
      this.data.profile.dob
        ? this.uiService.closeDialog(null)
        : this.prepareBirthdayForm();
    } else if (this.uiID == 4) {
      this.uiService.closeDialog(null);
    }
  }

  saveProfile() {}
}
