import { Component, inject, input, model } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

// Forms
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// Services
import { FormService } from '../../../core/services/form.service';

// Enums
import { FormField } from '../../../models/formField.model';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app-datepicker.component.html',
  styleUrl: './app-datepicker.component.scss',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class AppDatepickerComponent {
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
  shouldResetControls = input<BehaviorSubject<boolean>>();
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();
  formControl!: FormControl;

  subs: Subscription = new Subscription();

  ngOnInit() {
    this.formControl = this.formService.form.controls[
      this.field().name
    ] as FormControl;
    this.subs = this.shouldResetControls()?.subscribe((value) => {
      if (value) {
        setTimeout(() => {
          this.formControl = this.formService.form.controls[
            this.field().name
          ] as FormControl;
        }, 0);
      }
    })!;
  }

  ngOnDestroy() {
    this.subs?.unsubscribe();
  }
}
