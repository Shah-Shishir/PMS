import { Component, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Forms
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Services
import { ProfileService } from '../../../../../services/profile.service';

@Component({
  selector: 'profile-bio',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: './bio.component.html',
  styleUrl: './bio.component.scss',
})
export class BioComponent {
  service = inject(ProfileService);
  profileInfoForm!: FormGroup;

  constructor() {
    this.prepareForm();
  }

  prepareForm() {
    this.profileInfoForm = new FormGroup({
      bio: new FormControl(this.service.profile.bio, [
        Validators.maxLength(200),
      ]),
    });
  }

  toggleBioEditor() {
    this.service.isEditable.bio = !this.service.isEditable.bio;
  }

  async saveBio() {
    this.profileInfoForm.disable();
    this.service.profile.bio = this.profileInfoForm.value.bio;
    await this.service.setProfile(this.service.profile, false, 'Bio Updated');
    this.profileInfoForm.enable();
    this.service.isEditable.bio = false;
  }
}
