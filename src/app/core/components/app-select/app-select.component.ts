import { Component, inject, model } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

// Services
import { FormService } from '../../services/form.service';

// Models
import { FormField } from '../../../models/formField.model';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './app-select.component.html',
  styleUrl: './app-select.component.scss'
})
export class AppSelectComponent {
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
  formService = inject(FormService);
}
