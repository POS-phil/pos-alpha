import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { InfoSnackbarComponent } from '../../components/dialogs/notifications/info-snackbar/info-snackbar.component';
import { SuccessSnackbarComponent } from '../../components/dialogs/notifications/success-snackbar/success-snackbar.component';

@Injectable()
export class NotificationService {

  constructor(private readonly snackBar: MatSnackBar) { }

  success(message: string) {
    this.snackBar.openFromComponent(SuccessSnackbarComponent, {
      data: message,
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success']
    });
  }

  error(message: string) {
    
  }

  warning(message: string) {
    
  }

  info(message: string) {
    this.snackBar.openFromComponent(InfoSnackbarComponent, {
      data: message,
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-info']
    });
  }



}
