import { Component, inject } from '@angular/core';

// Components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';

// Services
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../core/services/ui.service';

// Enums
import { AuthProvider } from '../../utils/enums/auth-provider.enum';
import { FormType } from '../../utils/enums/form-type.enum';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [AppHeaderComponent, AuthButtonComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private authService = inject(AuthService);
  private uiService = inject(UiService);

  authProviders = AuthProvider;
  formTypes = FormType;

  openAuthDialog(mode: string) {
    this.uiService.openDialog(AuthDialogComponent, { mode }, '400px');
  }

  connectWithAuthProvider(authProvider: string) {
    this.authService.signInWithProvider(authProvider);
  }
}
