import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { AppService } from '../../../../../core/services/app.service';
import { ProfileService } from '../../../../../services/profile.service';

@Component({
  selector: 'profile-hobbies',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './hobbies.component.html',
  styleUrl: './hobbies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HobbiesComponent {
  appService = inject(AppService);
  profileService = inject(ProfileService);

  hobbies = signal(
    this.appService.returnCopy(this.profileService.profile.hobbies)
  );
  formControl = new FormControl([]);

  openHobbiesForm() {
    this.profileService.isEditable.hobbies = true;
  }

  closeHobbiesForm() {
    this.profileService.isEditable.hobbies = false;
    this.hobbies.set(
      this.appService.returnCopy(this.profileService.profile.hobbies)
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.hobbies.update((hobbies) => [...(hobbies ?? []), value]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  async saveHobbies() {
    this.profileService.profile.hobbies = this.hobbies();
    this.formControl.disable();
    await this.profileService.setProfile(
      this.profileService.profile,
      false,
      'Hobbies Updated',
      true
    );
    this.formControl.enable();
    this.profileService.isEditable.hobbies = false;
  }

  removeHobby(index: number) {
    this.hobbies()?.splice(index, 1);
  }
}
