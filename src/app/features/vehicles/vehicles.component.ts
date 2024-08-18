import { Component } from '@angular/core';

// Components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';
import { VehicleFormComponent } from "./components/vehicle-form/vehicle-form.component";
import { VehicleListComponent } from "./components/vehicle-list/vehicle-list.component";

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [AppHeaderComponent, VehicleFormComponent, VehicleListComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent {

}
