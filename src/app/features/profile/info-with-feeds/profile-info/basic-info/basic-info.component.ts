import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

// Forms
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { AppDatepickerComponent } from '../../../../../core/components/app-datepicker/app-datepicker.component';

// Models
import { FormField } from '../../../../../models/formField.model';

// Services
import { AppService } from '../../../../../core/services/app.service';
import { FormService } from '../../../../../core/services/form.service';
import { ProfileService } from '../../../../../services/profile.service';

// Pipes
import { AddressFormatterPipe } from '../../../../../core/pipes/address-formatter.pipe';

@Component({
  selector: 'profile-basic-info',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    AppDatepickerComponent,
    AddressFormatterPipe,
    DatePipe,
  ],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss',
})
export class BasicInfoComponent {
  appService = inject(AppService);
  service = inject(ProfileService);
  formService = inject(FormService);

  field!: FormField;

  profileInfoForm!: FormGroup;
  isLongAddress: boolean = false;

  constructor() {
    this.prepareForm();
  }

  prepareForm() {
    this.profileInfoForm = new FormGroup({
      longDescription: new FormControl(
        this.service.profile?.address?.longDescription
      ),
      country: new FormControl(this.service.profile.address?.country),
      state: new FormControl(this.service.profile.address?.state),
      division: new FormControl(this.service.profile.address?.division),
      city: new FormControl(this.service.profile.address?.city),
    });
  }

  toggleAddressEditor() {
    this.service.isEditable.address = !this.service.isEditable.address;
  }

  async saveAddress() {
    this.profileInfoForm.disable();

    const { longDescription, country, state, division, city } =
      this.profileInfoForm.value;

    this.service.profile = {
      ...this.service.profile,
      address: {
        longDescription,
        country,
        state,
        division,
        city,
      },
    };

    await this.service.setProfile(
      this.service.profile,
      false,
      'Address Updated'
    );

    this.profileInfoForm.enable();

    this.service.isEditable.address = false;
  }

  prepareBirthdayForm() {
    this.formService.prepareBirthdayForm(this.service.profile.dob!);
    this.field = {
      id: 1,
      isRequired: false,
      label: 'Birthday',
      name: 'dob',
    };
    this.service.isEditable.birthday = true;
  }

  async saveBirthday() {
    const dob = this.appService.formatMomentDate(
      this.formService.form.value.dob
    );
    this.service.profile.dob = dob;
    await this.service.setProfile(this.service.profile, false, 'Birthday Updated');
    this.formService.reinitializeForm();
    this.service.isEditable.birthday = false;
  }
}
