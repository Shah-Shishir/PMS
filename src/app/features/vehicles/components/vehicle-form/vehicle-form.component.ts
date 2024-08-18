import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, NgFor } from '@angular/common';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatButtonModule } from '@angular/material/button';
import { Status, Vehicle, VehicleType } from '../../../../models/vehicle.model';
import { VehicleService } from '../../../../services/vehicle.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatRadioModule,
    MatSelectModule,
    NgxMatDatetimePickerModule,
    MatDatepickerModule,
    NgxMatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss']
})
export class VehicleFormComponent {
  vehicleService = inject(VehicleService);

  vehicleTypes = [
    { type: 'Microbus', charge: 50 },
    { type: 'Car', charge: 40 },
    { type: 'Truck', charge: 60 },
  ];

  statusOptions = [
    {
      label: 'In', value: 'in'
    },
    {
      label: 'Out', value: 'out'
    }
  ];

  onVehicleTypeChange() {
    const selectedVehicleType = this.vehicleService.vehicleForm.get('vehicleType')?.value;
    const selectedType = this.vehicleTypes.find(type => type.type === selectedVehicleType);
    if (selectedType) {
      this.vehicleService.vehicleForm.get('parkingCharge')?.setValue(selectedType.charge.toString());
    }
  }

  onSubmit() {
    if (this.vehicleService.vehicleForm.valid) {
      const { value } = this.vehicleService.vehicleForm;

      const vehicle: Vehicle = {
        licenseNumber: value.licenseNumber!,
        vehicleType: value.vehicleType as VehicleType,
        ownerName: value.ownerName!,
        ownerPhone: value.ownerPhone!,
        status: value.status! as Status,
        ownerAddress: value.ownerAddress!,
        entryTime: new Date(value.entryDateTime!).toISOString(),
        exitTime: new Date(value.exitDateTime!).toISOString() ?? '',
        parkingCharge: +value.parkingCharge!
      }

      this.vehicleService.createVehicle(vehicle);
    }
  }
}
