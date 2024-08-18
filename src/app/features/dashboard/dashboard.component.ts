import { Component, inject } from '@angular/core';
import { AppHeaderComponent } from "../../core/components/app-header/app-header.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { formatDate, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AppHeaderComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCardModule,
    NgFor
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  fb = inject(FormBuilder);
  vehicleService = inject(VehicleService);

  filterForm!: FormGroup;
  today: string;
  filteredVehicles: any[] = [];
  vehicleTypesCount: Record<string, number> = {
    Microbus: 0,
    Car: 0,
    Truck: 0
  };
  totalCarsParked: number = 0;
  totalEmptySlots: number = 0;
  vehiclesOverTwoHours: any[] = [];

  constructor() {
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      date: [this.today]
    });

    this.applyFilter();

    this.filterForm.get('date')?.valueChanges.subscribe(date => {
      this.applyFilter(date);
    });
  }

  applyFilter(date = this.today) {
    this.filteredVehicles = this.vehicleService.vehicles.filter(vehicle => {
      return formatDate(vehicle.entryTime, 'yyyy-MM-dd', 'en') === date;
    });

    this.totalCarsParked = this.filteredVehicles.length;
    this.totalEmptySlots = this.calculateEmptySlots();
    this.calculateVehicleTypesCount();
    this.calculateVehiclesOverTwoHours();
  }

  calculateVehicleTypesCount() {
    this.vehicleTypesCount = { Microbus: 0, Car: 0, Truck: 0 };
    this.filteredVehicles.forEach(vehicle => {
      if (vehicle.vehicleType in this.vehicleTypesCount) {
        switch (vehicle.vehicleType) {
          case 'Microbus': {
            this.vehicleTypesCount['Microbus']++;
            break;
          }

          case 'Car': {
            this.vehicleTypesCount['Car']++;
            break;
          }

          case 'Truck': {
            this.vehicleTypesCount['Truck']++;
            break;
          }
        }
      }
    });
  }

  calculateVehiclesOverTwoHours() {
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    this.vehiclesOverTwoHours = this.filteredVehicles.filter(vehicle => {
      const entryTime = new Date(vehicle.entryTime);
      const exitTime = vehicle.exitTime ? new Date(vehicle.exitTime) : null;

      // Consider vehicles parked for more than two hours and have not exited yet or exited after two hours ago.
      return (entryTime < twoHoursAgo) && (!exitTime || exitTime > twoHoursAgo);
    });
  }

  calculateEmptySlots(): number {
    let count = 0;

    for (const vehicle of this.vehicleService.vehicles) {
      if (vehicle.status === 'out') {
        ++count;
      }
    }

    return count;
  }
}
