import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipSet } from '@angular/material/chips';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuPanel } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule, MatSlideToggle } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { ScheduleEntry } from '../../../../../../common/categories';
import { MenuCategoryAvailabilityComponent } from '../../../../../dialogs/menu-category-availability/menu-category-availability.component';
import { UploadImageComponent } from '../../../../../dialogs/upload-image/upload-image.component';
import { MatDialog } from '@angular/material/dialog';
import { SafeUrl } from '@angular/platform-browser';
import { MatDivider } from "@angular/material/divider";
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';

import { MatChip } from "../../../../../../../../node_modules/@angular/material/chips/index";

@Component({
  selector: 'app-recipe',
   standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatDatepickerModule,
    MatNativeDateModule

],
providers: [  
  MatDatepickerModule,  
],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss'
})
export class RecipeComponent implements OnInit{
confirmCreate() {
throw new Error('Method not implemented.');
}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
