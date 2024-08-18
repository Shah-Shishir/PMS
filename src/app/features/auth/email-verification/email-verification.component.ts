import { Component } from '@angular/core';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent {
  auth = getAuth();
}
