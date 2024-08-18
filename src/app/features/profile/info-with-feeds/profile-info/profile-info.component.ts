import { Component } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { BioComponent } from './bio/bio.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { EducationProfessionComponent } from './education-profession/education-profession.component';
import { HobbiesComponent } from './hobbies/hobbies.component';

// Forms
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'profile-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BioComponent,
    BasicInfoComponent,
    EducationProfessionComponent,
    HobbiesComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss',
})
export class ProfileInfoComponent {
  constructor() {}
}
