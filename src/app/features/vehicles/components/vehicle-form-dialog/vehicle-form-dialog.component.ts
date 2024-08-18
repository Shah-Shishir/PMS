import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatButtonModule } from '@angular/material/button';
import { Status, Vehicle, VehicleType } from '../../../../models/vehicle.model';
import { VehicleService } from '../../../../services/vehicle.service';
import {
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-vehicle-form-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './vehicle-form-dialog.component.html',
  styleUrl: './vehicle-form-dialog.component.scss',
})
export class VehicleFormDialogComponent {
  vehicleService = inject(VehicleService);

  readonly data = inject<any>(MAT_DIALOG_DATA);

  vehicleTypes = [
    { type: 'Microbus', charge: 600 },
    { type: 'Car', charge: 500 },
    { type: 'Truck', charge: 800 },
  ];

  statusOptions = [
    {
      label: 'In', value: 'in'
    },
    {
      label: 'Out', value: 'out'
    }
  ];

  constructor() {
    console.log(this.data);
  }

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
        id: this.data ? this.vehicleService.vehicleIdToUpdate : this.vehicleService.vehicles.length + 1,
        licenseNumber: value.licenseNumber!,
        vehicleType: value.vehicleType as VehicleType,
        ownerName: value.ownerName!,
        ownerPhone: value.ownerPhone!,
        status: value.status! as Status,
        ownerAddress: value.ownerAddress!,
        entryTime: new Date(value.entryDateTime!).toISOString(),
        exitTime: value.exitDateTime ? new Date(value.exitDateTime).toISOString() : '',
        parkingCharge: +value.parkingCharge!
      }

      if (this.data) {
        this.vehicleService.updateVehicle(vehicle);
      } else {
        this.vehicleService.createVehicle(vehicle);
      }

    }
  }
}
