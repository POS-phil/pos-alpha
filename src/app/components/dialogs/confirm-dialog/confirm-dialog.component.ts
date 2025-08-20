import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ title() }}</h2>
    <mat-dialog-content>
      <p>{{ message() }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">{{ cancelText() }}</button>
      <button mat-flat-button (click)="onConfirm()">
        {{ confirmText() }}
      </button>
    </mat-dialog-actions>
  `,
  styles: ``
})
export class ConfirmDialogComponent {
  
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  private data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  title = signal(this.data.title ?? 'Confirm Action');
  message = signal(this.data.message);
  confirmText = signal(this.data.confirmText ?? 'Yes');
  cancelText = signal(this.data.cancelText ?? 'Cancel');

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
