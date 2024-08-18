import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Components
import { AppHeaderComponent } from "./core/components/app-header/app-header.component";

// Environment
import { environment } from '../environments/environment.prod';

// Services
import { AppService } from './core/services/app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-connect';
  appService = inject(AppService);

  ngOnInit() {
    const app = initializeApp(environment.firebase);
    this.appService._appDB = getFirestore(app);
  }
}
