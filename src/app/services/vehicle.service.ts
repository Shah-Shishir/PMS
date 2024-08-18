import { Injectable, inject } from '@angular/core';

// Models
import { Vehicle } from '../models/vehicle.model';

// Enums
import { Collection } from '../utils/enums/collection.enum';

// Services
import { AppService } from '../core/services/app.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UiService } from '../core/services/ui.service';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  appService = inject(AppService);
  uiService = inject(UiService);

  vehicles: Vehicle[] = [];
  dataSource: MatTableDataSource<Vehicle> = new MatTableDataSource<Vehicle>();
  vehicleIdToUpdate: number = -1;

  creatingVehicle: boolean = false;

  vehicleForm = new FormGroup({
    licenseNumber: new FormControl('', [Validators.required]),
    vehicleType: new FormControl('', [Validators.required]),
    ownerName: new FormControl('', [Validators.required]),
    ownerPhone: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    ownerAddress: new FormControl('', [Validators.required]),
    entryDateTime: new FormControl('', [Validators.required]),
    exitDateTime: new FormControl(''),
    parkingCharge: new FormControl('', [Validators.required]),
  });

  constructor() {
    this.vehicles = this.getVehicleList();
  }

  getVehicleList() {
    return JSON.parse(localStorage.getItem(Collection.VEHICLES) ?? "[]");
  }

  setVehicleList() {
    localStorage.setItem(Collection.VEHICLES, JSON.stringify(this.vehicles));
    this.dataSource.data = this.vehicles;
  }

  createVehicle(vehicle: Vehicle) {
    if (vehicle.exitTime && (vehicle.entryTime > vehicle.exitTime)) {
      this.uiService.openSnackbar("Wrong exit time", true);
      return;
    }

    this.vehicles = this.getVehicleList();
    this.vehicles.push({ ...vehicle, id: this.vehicles.length + 1 });

    this.finalize();
  }

  updateVehicle(vehicle: Vehicle) {
    if (vehicle.exitTime && (vehicle.entryTime > vehicle.exitTime)) {
      this.uiService.openSnackbar("Wrong exit time", true);
      return;
    }

    const index = this.vehicles.findIndex(vehicleEl => vehicleEl.id === vehicle.id);
    this.vehicles[index] = vehicle;

    this.finalize(true);
  }

  finalize(isEdit = false) {
    this.setVehicleList();
    this.vehicleForm.reset();
    this.clearValidationErrors();
    this.uiService.closeDialog(null);
    this.uiService.openSnackbar(`Vehicle data ${isEdit ? 'updated' : 'added'}`);
  }

  clearValidationErrors(): void {
    Object.keys(this.vehicleForm.controls).forEach(key => {
      const control = this.vehicleForm.get(key);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
        control.setErrors(null);
      }
    });
  }

  patchVehicleForm(vehicle: Vehicle) {
    this.vehicleIdToUpdate = vehicle.id;

    this.vehicleForm.patchValue({
      licenseNumber: vehicle.licenseNumber,
      vehicleType: vehicle.vehicleType,
      ownerName: vehicle.ownerName,
      ownerPhone: vehicle.ownerPhone,
      status: vehicle.status,
      ownerAddress: vehicle.ownerAddress,
      entryDateTime: vehicle.entryTime,
      exitDateTime: vehicle.exitTime,
      parkingCharge: vehicle.parkingCharge.toString(),
    });

  }
}

