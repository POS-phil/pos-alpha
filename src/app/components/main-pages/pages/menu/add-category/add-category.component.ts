import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { SafeUrl } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';

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
    MatMenuModule
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
})
export class AddCategoryComponent implements OnInit{

  icons = [
    'breakfast_dining', 'free_breakfast', 'bakery_dining', 'brunch_dining', 'coffee',
    'coffee_maker', 'dining', 'dinner_dining', 'emoji_food_beverage', 'flatware',
    'local_dining', 'lunch_dining', 'rice_bowl', 'soup_kitchen', 'kebab_dining',
    'egg_alt', 'fastfood', 'set_meal', 'room_service', 'tapas', 'takeout_dining',
  ];

  selectedIcon = 'fastfood';

  selectIcon(icon: string) {
    this.selectedIcon = icon;
  }

  createCategoryForm!: FormGroup;

  readonly dialog = inject(MatDialog);
  uploadedImage: SafeUrl | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }

  get categoryName() {
    return this.createCategoryForm.get('category_name')!;
  }

  ngOnInit(): void {
    this.createCategoryForm = this.fb.group({
      category_name: ['', Validators.required],
      image: [null],
      reference: ['', Validators.required],
      schedule: this.fb.array([]), // Initialize with an empty array
      item: [0, Validators.required],
      web_shop: [false],
      aggregator: [false],
      kiosk: [false],
      created_at: [new Date()],
    });
  }

  confirmCreate(): void {

  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(UploadImageComponent, {
      width: '1500px',
      height: '900px',
      maxWidth: '150vw',
      data: this.uploadedImage

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.uploadedImage = result;
      }
    });

    dialogRef.componentInstance.imageRemoved.subscribe(() => {
      this.uploadedImage = null;
      this.cdr.detectChanges();
    });

  };

}
