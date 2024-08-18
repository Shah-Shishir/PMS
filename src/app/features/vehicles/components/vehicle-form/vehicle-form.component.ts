import { Component, inject } from '@angular/core';
import { UiService } from '../../../../core/services/ui.service';
import { MatButtonModule } from '@angular/material/button';
import { VehicleFormDialogComponent } from '../vehicle-form-dialog/vehicle-form-dialog.component';
@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
})
export class VehicleFormComponent {
  uiService = inject(UiService);

  openAddVehicleForm() {
    this.uiService.openDialog(VehicleFormDialogComponent);
  }
}
