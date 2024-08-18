import { Component, inject, OnInit } from '@angular/core';
import { VehicleService } from '../../../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent implements OnInit {
  vehicleService = inject(VehicleService);

  ngOnInit() {
    console.log(this.vehicleService.getVehicleList());
  }
}
