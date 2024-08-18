import { Component, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';
import { AppSelectComponent } from '../../core/components/app-select/app-select.component';
import { ConfirmDeleteDialogComponent } from '../../core/components/confirm-delete-dialog/confirm-delete-dialog.component';

// Services
import { AppService } from '../../core/services/app.service';
import { AuthService } from '../../services/auth.service';
import { FormService } from '../../core/services/form.service';
import { ProfileService } from '../../services/profile.service';
import { UiService } from '../../core/services/ui.service';

// Enums
import { PageType } from '../../utils/enums/page-type.enum';

// Pipes
import { PrivacyTypePipe } from '../../core/pipes/privacy-type.pipe';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
  imports: [
    AppHeaderComponent,
    AppSelectComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PrivacyTypePipe,
  ],
})
export class ProfileSettingsComponent {
  pageTypes = PageType;

  appService = inject(AppService);
  authService = inject(AuthService);
  formService = inject(FormService);
  profileService = inject(ProfileService);
  uiService = inject(UiService);

  async saveProfile() {
    const updatedProfile = { ...this.profileService.profile };

    if (this.profileService.isEditable.birthday) {
      const dob = this.appService.formatMomentDate(
        this.formService.form.value.dob
      );
      updatedProfile.dob = dob;
    }

    if (this.profileService.isEditable.privacy) {
      updatedProfile.privacyId = this.formService.form.value.privacyId;
    }

    await this.profileService.setProfile(updatedProfile);

    this.profileService.isEditable = {
      birthday: false,
      privacy: false,
      bio: false,
      address: false,
      hobbies: false,
    };
  }

  signOutUser(fromDeletion: boolean = false) {
    this.authService.signOut(fromDeletion);
  }

  openConfirmProfileDeletionDialog() {
    this.uiService.openDialog(ConfirmDeleteDialogComponent, {
      deleteText: 'your profile',
    });

    this.uiService.dialogRef.afterClosed().subscribe((res: any) => {
      res && this.deleteUser();
    });
  }

  async deleteUser() {
    this.profileService.deletingProfile = true;
    await this.authService.deleteUserProfile();
    await this.authService.deleteUserAccount();
    this.authService.signOut(true);
  }
}
