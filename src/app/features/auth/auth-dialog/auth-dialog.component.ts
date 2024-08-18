import { Component, Inject, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Components
import { AppFormComponent } from '../../../core/components/app-form/app-form.component';
import { AppLoaderComponent } from '../../../core/components/app-loader/app-loader.component';

// Forms
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Router
import { Router } from '@angular/router';

// Enums & Constants
import { DialogMode } from '../../../utils/enums/dialog-mode.enum';
import { FieldType } from '../../../utils/enums/field-type.enum';
import { FormType } from '../../../utils/enums/form-type.enum';

// Services
import { AuthService } from '../../../services/auth.service';
import { AppService } from '../../../core/services/app.service';
import { FormService } from '../../../core/services/form.service';

// Models
import { AuthUser } from '../../../models/auth-user.model';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    AppFormComponent,
    AppLoaderComponent,
  ],
})
export class AuthDialogComponent {
  dialogModes = DialogMode;
  fieldTypes = FieldType;

  headerTitle: string =
    this.data.mode == FormType.SIGNIN ? 'Complete Sign In' : 'Complete Sign Up';
  btnLabel: string = this.data.mode == FormType.SIGNIN ? 'Sign In' : 'Sign Up';

  authService = inject(AuthService);
  appService = inject(AppService);
  formService = inject(FormService);
  router = inject(Router);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { mode: string }) {}

  ngOnInit() {
    this.formService.getAuthFormFields(this.data);
    this.formService.watchFormEvents();
  }

  onAuthFormSubmit(event: FormGroup<any>) {
    const authFormValue: AuthUser = event.value;

    if (this.data.mode == FormType.SIGNIN) {
      this.onSignIn(authFormValue);
    } else if (this.data.mode == FormType.SIGNUP) {
      this.onSignUp(authFormValue);
    } else if (this.data.mode == FormType.FORGOT_PASSWORD) {
      this.onForgotPassword(authFormValue.email);
    }
  }

  onSignIn(signInFormValue: Partial<AuthUser>) {
    this.authService.signIn(signInFormValue);
  }

  onSignUp(signUpFormValue: AuthUser) {
    this.authService.signUp(signUpFormValue);
  }

  onForgotPassword(passwordResetEmail: string) {
    this.authService.forgotPassword(passwordResetEmail);
  }

  prepareSignInForm() {
    this.data.mode = FormType.SIGNIN;
    this.headerTitle = 'Complete Sign In';
    this.btnLabel = 'Sign In';
    this.formService.reinitializeForm();
    this.formService.getAuthFormFields({ mode: FormType.SIGNIN });
    this.formService.watchFormEvents();
  }

  prepareForgotPasswordForm() {
    this.data.mode = FormType.FORGOT_PASSWORD;
    this.headerTitle = 'Reset Password';
    this.btnLabel = 'Reset';
    this.formService.reinitializeForm();
    this.formService.getAuthFormFields({ mode: FormType.FORGOT_PASSWORD });
    this.formService.watchFormEvents();
  }

  ngOnDestroy() {
    this.formService.reinitializeForm();
  }
}
