import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { VehicleService } from '../../../../services/vehicle.service';
import { Vehicle } from '../../../../models/vehicle.model';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UiService } from '../../../../core/services/ui.service';
import { VehicleFormDialogComponent } from '../vehicle-form-dialog/vehicle-form-dialog.component';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule, DatePipe, TitleCasePipe],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];

  uiService = inject(UiService);
  vehicleService = inject(VehicleService);

  displayedColumns: string[] = ['ownerName', 'vehicleType', 'licenseNumber', 'entryTime', 'exitTime', 'status', 'edit'];

  ngOnInit() {
    this.vehicleService.dataSource.data = this.vehicleService.vehicles;
  }

  openEditForm(vehicle: Vehicle) {
    this.vehicleService.patchVehicleForm(vehicle);
    this.uiService.openDialog(VehicleFormDialogComponent, {
      isEdit: true
    });
  }
}
