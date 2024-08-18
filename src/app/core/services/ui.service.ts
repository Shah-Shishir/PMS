import { Injectable, inject } from '@angular/core';

// Angular Material
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  snackBar = inject(MatSnackBar);

  dialogRef: any;
  dialog = inject(MatDialog);

  openDialog(
    component: ComponentType<any>,
    data?: any,
    width?: string,
    height?: string,
    disableClose: boolean = true
  ) {
    this.dialogRef = this.dialog.open(component, {
      width,
      data,
      disableClose,
      height,
    });
  }

  closeDialog(closeData: any) {
    this.dialogRef.close(closeData);
  }

  openSnackbar(
    message: string,
    isError: boolean = false,
    duration: number = 1000
  ) {
    this.snackBar.open(message, '', {
      panelClass: isError ? 'error-snackbar' : 'success-snackbar',
      duration,
    });
  }

  openSnackbarFromComponent(component: ComponentType<any>) {
    this.snackBar.openFromComponent(component, {
      duration: 3000,
    });
  }
}
