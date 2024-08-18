import { Component, input } from '@angular/core';

// Models
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-image-placeholder',
  standalone: true,
  imports: [],
  templateUrl: './image-placeholder.component.html',
  styleUrl: './image-placeholder.component.scss',
})
export class ImagePlaceholderComponent {
  profile = input.required<Profile>();
  height = input.required<number>();
  width = input.required<number>();
  fontSize = input.required<number>();

  constructor() {}
}
