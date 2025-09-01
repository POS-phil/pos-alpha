import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-info-snackbar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  template: `
      <mat-icon class="info-icon">info</mat-icon>
      <span class="message-font">{{ data }}</span>
      <span class="spacer"></span>
      <button matButton (click)="close()">OK</button>
  `,
  styles: `

  .message-font {
    font-weight: 700px;
    font-size: 15px;
  }

  .info-icon {
    color: #2196f3;
    font-size: 30px;
    width : 30px;
    height : 30px;
  }

  .spacer {
      flex: 1 1 auto;
  }

  `
})
export class InfoSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string,
    private snackRef: MatSnackBarRef<InfoSnackbarComponent>) { }

  close() {
    this.snackRef.dismiss();
  }

}
