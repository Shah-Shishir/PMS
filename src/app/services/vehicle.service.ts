import { Injectable, inject, model } from '@angular/core';

// Firebase
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';

// Models
import { Vehicle } from '../models/vehicle.model';

// Enums
import { Collection } from '../utils/enums/collection.enum';

// Services
import { AppService } from '../core/services/app.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UiService } from '../core/services/ui.service';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  appService = inject(AppService);
  uiService = inject(UiService);

  vechicles: Vehicle[] = [];

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

  getVehicleList() {
    const vehicles: Vehicle[] = JSON.parse(localStorage.getItem(Collection.VEHICLES) ?? "[]");
    return vehicles;
  }

  setVehicleList(vehicles: Vehicle[]) {
    localStorage.setItem(Collection.VEHICLES, JSON.stringify(vehicles));
  }

  createVehicle(vehicle: Vehicle) {
    this.creatingVehicle = true;

    const vehicles: Vehicle[] = this.getVehicleList();
    vehicles.push({ ...vehicle, id: vehicles.length + 1 });
    this.setVehicleList(vehicles);

    this.vehicleForm.reset();
    this.clearValidationErrors();

    this.uiService.openSnackbar("Vehicle data added");

    console.log(vehicles);
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
}
