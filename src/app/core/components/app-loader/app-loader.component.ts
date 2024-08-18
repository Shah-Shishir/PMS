import { Component, input } from '@angular/core';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './app-loader.component.html',
  styleUrl: './app-loader.component.scss',
})
export class AppLoaderComponent {
  label = input<string>();
  color = input<string>("primary");
  height = input.required<number>();
  width = input.required<number>();
}
