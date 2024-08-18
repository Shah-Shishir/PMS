import { Component, inject } from '@angular/core';

// Services
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'profile-name-section',
  standalone: true,
  imports: [],
  templateUrl: './name-section.component.html',
  styleUrl: './name-section.component.scss'
})
export class NameSectionComponent {
  profileService = inject(ProfileService);
}
