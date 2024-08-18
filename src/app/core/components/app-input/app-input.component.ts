import { Component, inject, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Models
import { FormField } from '../../../models/formField.model';

// Services
import { FormService } from '../../services/form.service';

// Pipes
import { InputTypePipe } from '../../pipes/input-type.pipe';

// Enums
import { FieldType } from '../../../utils/enums/field-type.enum';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './app-input.component.html',
  styleUrl: './app-input.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    InputTypePipe,
  ],
})
export class AppInputComponent {
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

  formService = inject(FormService);
  fieldTypes = FieldType;
  shouldShowEye!: boolean;

  formControl!: FormControl;

  isVisible: boolean = false;
  visibleIconPath: string = 'assets/icons/visibility.svg';
  invisibleIconPath: string = 'assets/icons/visibility_off.svg';

  subs: Subscription = new Subscription();

  ngOnInit() {
    this.shouldShowEye = this.fieldTypes.PASSWORD === this.field().type;
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

  toggleInput() {
    this.isVisible = !this.isVisible;
    this.field().type = this.isVisible ? FieldType.TEXT : FieldType.PASSWORD;
  }

  ngOnDestroy() {
    this.subs?.unsubscribe();
  }
}
