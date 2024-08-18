import { Component, input, output } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.scss'
})
export class AuthButtonComponent {
  btnLabel = input.required<string>();
  btnIconPath = input.required<string>();
  onPressed = output<void>();
}
