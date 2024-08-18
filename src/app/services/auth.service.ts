import { Injectable, inject } from '@angular/core';

// Firebase
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

// Router
import { Router } from '@angular/router';
import { RouteNames } from '../app.routes';

// Auth
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  AuthProvider,
  GithubAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
} from 'firebase/auth';
import { AuthProvider as AProvider } from '../utils/enums/auth-provider.enum';

// Components
import { EmailVerificationComponent } from '../features/auth/email-verification/email-verification.component';

// Services
import { AppService } from '../core/services/app.service';
import { FormService } from '../core/services/form.service';
import { UiService } from '../core/services/ui.service';
import { ProfileService } from './profile.service';

// Models
import { AuthUser } from '../models/auth-user.model';

// Enums
import { Collection } from '../utils/enums/collection.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = getAuth();
  router = inject(Router);

  appService = inject(AppService);
  uiService = inject(UiService);
  formService = inject(FormService);
  profileService = inject(ProfileService);

  isAuthLoading: boolean = false;
  settingUserData: boolean = false;
  sendingEmail: boolean = false;

  handleAuthErrors(error: any) {
    let errorMessage: string;

    switch (error.code) {
      case 'auth/email-already-in-use': {
        errorMessage = 'Email already in use';
        break;
      }
      case 'auth/invalid-credential': {
        errorMessage = 'Incorrect email or password';
        break;
      }
      default: {
        errorMessage = 'Errors occur during sign in. Try after sometimes';
      }
    }

    this.uiService.openSnackbar(errorMessage, true);
    this.formService.form.enable();
  }

  signIn(signInFormValue: Partial<AuthUser>) {
    this.isAuthLoading = true;

    signInWithEmailAndPassword(
      this.auth,
      signInFormValue.email!,
      signInFormValue.password!
    )
      .then((result: any) => {
        this.formService.reinitializeForm();
        this.uiService.closeDialog(null);
        this.uiService.openSnackbar('Signed in successfully');
        localStorage.setItem('token', result.user['accessToken']);
        localStorage.setItem('userId', result.user['uid']);
      })
      .catch((error) => {
        this.handleAuthErrors(error);
      })
      .finally(() => {
        this.isAuthLoading = false;
      });
  }

  signUp(signUpFormValue: AuthUser) {
    signUpFormValue.dob = this.appService.formatMomentDate(
      signUpFormValue.dob ?? ''
    );

    this.isAuthLoading = true;

    return createUserWithEmailAndPassword(
      this.auth,
      signUpFormValue.email,
      signUpFormValue.password
    )
      .then(async (result: any) => {
        this.formService.reinitializeForm();
        await this.profileService.setProfile(
          {
            uid: result.user.uid,
            firstName: signUpFormValue.firstName,
            lastName: signUpFormValue.lastName,
            email: signUpFormValue.email,
            displayName: signUpFormValue.displayName,
            photoURL: null,
            photoName: null,
            coverPhotoURL: null,
            coverPhotoName: null,
            isEmailVerified: result.user.emailVerified,
            phoneNumber: null,
            genderId: signUpFormValue.genderId,
            dob: signUpFormValue.dob,
            privacyId: 1,
            bio: '',
            address: {
              longDescription: '',
              country: '',
              state: '',
              division: '',
              city: '',
            },
            educationalHistory: {
              schools: [],
              colleges: [],
              universities: [],
            },
            workExperiences: [],
            hobbies: [],
            feeds: [],
          },
          true
        );
        await this.sendEmailVerification();
      })
      .catch((error) => {
        this.handleAuthErrors(error);
      })
      .finally(() => {
        this.isAuthLoading = false;
      });
  }

  async sendEmailVerification() {
    this.sendingEmail = true;

    sendEmailVerification(this.auth.currentUser!)
      .then((_) => {
        this.uiService.openSnackbarFromComponent(EmailVerificationComponent);
      })
      .catch(() => {
        this.uiService.openSnackbar(
          'Error during sending email. Try after sometimes.',
          true,
          2000
        );
      })
      .finally(() => {
        this.sendingEmail = false;
      });
  }

  async forgotPassword(passwordResetEmail: string) {
    this.isAuthLoading = true;

    const userQuery = query(
      collection(this.appService._appDB, Collection.PROFILES),
      where('email', '==', passwordResetEmail)
    );

    const userSnap = await getDocs(userQuery);

    if (userSnap.empty) {
      this.uiService.openSnackbar(
        'No user found with this email address. Please provide a correct email',
        true,
        2000
      );
      this.isAuthLoading = false;
      this.formService.form.enable();
    } else {
      sendPasswordResetEmail(this.auth, passwordResetEmail)
        .then((_) => {
          this.formService.reinitializeForm();
          this.uiService.closeDialog(null);
          this.uiService.openSnackbar(
            'Password reset email sent to your email, kindly check your inbox',
            false,
            3000
          );
        })
        .catch((_) => {
          this.formService.form.enable();
          this.uiService.openSnackbar(
            'Error during resetting password. Please try after sometimes',
            true
          );
        })
        .finally(() => {
          this.isAuthLoading = false;
        });
    }
  }

  signInWithProvider(authProvider: String) {
    let provider: AuthProvider = new GoogleAuthProvider();

    if (authProvider == AProvider.GOOGLE) {
      provider = new GoogleAuthProvider();
    } else if (authProvider == AProvider.FACEBOOK) {
      provider = new FacebookAuthProvider();
    } else if (authProvider == AProvider.GITHUB) {
      provider = new GithubAuthProvider();
    }

    signInWithPopup(this.auth, provider).then(
      (res: any) => {
        localStorage.setItem('token', res.user['accessToken']);
      },
      (err) => {
        this.uiService.openSnackbar(err.message, true);
      }
    );
  }

  async deleteUserAccount() {
    await deleteUser(this.auth.currentUser!)
      .then(async () => {})
      .catch(() => {});
  }

  async deleteUserProfile() {
    const { profile } = this.profileService;
    const { uid, photoName, coverPhotoName } = profile;

    await deleteDoc(doc(this.appService._appDB, Collection.PROFILES, uid))
      .then(() => {})
      .catch(() => {});

    photoName &&
      (await this.profileService.deleteProfilePhoto(uid, photoName!));

    coverPhotoName &&
      (await this.profileService.deleteCoverPhoto(uid, photoName!));
  }

  signOut(fromDeletion: boolean = false) {
    this.auth.signOut().then(
      (_) => {
        localStorage.clear();

        fromDeletion
          ? this.uiService.openSnackbar('Signed out successfully')
          : this.uiService.openSnackbar(
              'Your profile has been deleted successfully'
            );
      },
      (_) => {
        !fromDeletion &&
          this.uiService.openSnackbar('Error occurred during signout', true);
      }
    );
  }
}
