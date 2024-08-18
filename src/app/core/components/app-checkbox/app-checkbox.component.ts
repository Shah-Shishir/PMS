import { Component, inject, model } from '@angular/core';

// Angular Material
import { MatCheckboxModule } from '@angular/material/checkbox';

// Forms
import { ReactiveFormsModule } from '@angular/forms';

// Services
import { FormService } from '../../services/form.service';

// Models
import { FormField } from '../../../models/formField.model';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './app-checkbox.component.html',
  styleUrl: './app-checkbox.component.scss',
})
export class AppCheckboxComponent {
  formService = inject(FormService);

  field = model<FormField>({
    id: 0,
    isRequired: false,
    label: '',
    maxLength: 0,
    minLength: 0,
    name: '',
    type: '',
    value: '',
    values: [],
  });
}
