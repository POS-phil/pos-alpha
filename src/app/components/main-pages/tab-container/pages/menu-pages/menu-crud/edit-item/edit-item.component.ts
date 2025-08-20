import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuPanel } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { ScheduleEntry } from '../../../../../../../common/menu-categories';
import { MenuCategoryAvailabilityComponent } from '../../../../../../dialogs/menu-category-availability/menu-category-availability.component';
import { UploadImageComponent } from '../../../../../../dialogs/upload-image/upload-image.component';
import { MatDialog } from '@angular/material/dialog';
import { SafeUrl } from '@angular/platform-browser';
import { MatDivider } from "@angular/material/divider";
import { MatPaginatorModule } from "@angular/material/paginator";

@Component({
  selector: 'app-create-item',
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
    MatMenuModule,
    MatTooltipModule,
    MatChipsModule,
    MatDivider,
    MatPaginatorModule
  ],
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.scss'
})
export class EditItemComponent {
  openAvailabilityDialog() {
    throw new Error('Method not implemented.');
  }
  categoryName: any;
  editItemForm!: FormGroup;
  uploadedImage: unknown;
  selectedIcon: any;
  scheduleSummary: any;
  confirmCreate() {
    throw new Error('Method not implemented.');
  }
  toggleAllRows() {
    throw new Error('Method not implemented.');
  }
  isSomeSelected() {
    throw new Error('Method not implemented.');
  }
  isAllSelected() {
    throw new Error('Method not implemented.');
  }
  announceSortChange($event: Event) {
    throw new Error('Method not implemented.');
  }
  MENU_CATEGORIES_DATA: any;

}
