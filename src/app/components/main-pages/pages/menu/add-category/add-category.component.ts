import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { UploadImageComponent } from '../../../../dialogs/upload-image/upload-image.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    MatInputModule,
    RouterModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatSelectModule,
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCategoryComponent {

  readonly dialog = inject(MatDialog);
  uploadedImage: string | null = null;

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(UploadImageComponent, {
      width: '1500px',
      height: '900px',
      maxWidth: '150vw',

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        
      }
    });

  };

}
