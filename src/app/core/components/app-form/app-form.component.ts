import { Component, SimpleChanges, inject, input, output } from '@angular/core';

// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { AppCheckboxComponent } from '../app-checkbox/app-checkbox.component';
import { AppDatepickerComponent } from '../app-datepicker/app-datepicker.component';
import { AppInputComponent } from '../app-input/app-input.component';
import { AppSelectComponent } from '../app-select/app-select.component';

// Services
import { FormService } from '../../services/form.service';

// Forms
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Enums
import { FieldType } from '../../../utils/enums/field-type.enum';
import { FormType } from '../../../utils/enums/form-type.enum';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    AppCheckboxComponent,
    AppInputComponent,
    AppSelectComponent,
    AppDatepickerComponent,
  ],
  templateUrl: './app-form.component.html',
  styleUrl: './app-form.component.scss',
})
export class AppFormComponent {
  formType = input<string>();
  headerTitle = input<string>();
  btnLabel = input<string>();
  isLoading = input<boolean>();
  shouldResetControls = input<BehaviorSubject<boolean>>();
  formService = inject(FormService);

  submitForm = output<FormGroup>();
  prepareSignInForm = output<void>();
  prepareForgotPasswordForm = output<void>();
  reinitControls = output<void>();

  formTypes = FormType;
  fieldTypes = FieldType;

  onSubmitForm() {
    this.formService.form.disable();
    this.submitForm.emit(this.formService.form);
  }
}
