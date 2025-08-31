import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, SecurityContext, signal, Signal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {
  MatDialog
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { UploadImageComponent } from '../../../../../dialogs/upload-image/upload-image.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuCategoryAvailabilityComponent } from '../../../../../dialogs/menu-category-availability/menu-category-availability.component';
import { MatChipsModule } from '@angular/material/chips';
import { ScheduleEntry } from '../../../../../../common/menu-categories';
import { MenuCategoriesService } from '../../../../../../service/api/menu-categories/menu-categories.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError, combineLatest, debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { NotificationService } from '../../../../../../service/notifications/notification.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { CategoryIdAndName } from '../../../../../../common/menu-categories';

export function categoryNameDuplicateValidator(service: MenuCategoriesService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    return of(control.value).pipe(
      debounceTime(300),
      switchMap(name => service.checkCategoryExists(name)),
      map(res => (res.exists ? { duplicateName: true } : null)),
      catchError(() => of(null))
    );
  };
}

export function autocompleteSelectionValidator(options: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputValue = control.value;

    if (!inputValue) return null;

    const isValid = options.some(option =>
      (typeof inputValue === 'object' && inputValue?.categoryId === option.categoryId) ||
      (typeof inputValue === 'string' && inputValue === option.categoryName)
    );

    return isValid ? null : { invalidSelection: true };
  };
}

@Component({
  selector: 'app-edit-category',
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
    MatSnackBarModule,

  ],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef,
    private menuCategoryService: MenuCategoriesService,
    private fb: FormBuilder,
    private route: Router,
    private sanitizer: DomSanitizer,
    private notification: NotificationService,
  ) { }

  editCategoryForm!: FormGroup;
  listOfCategory: CategoryIdAndName[] = [];

  background_colors = [
    '#e62e2eff', '#2d30fcff', '#f2f53eff', '#5af845ff', '#35eefcff',
    '#f751eeff', '#a817ebff', '#ececd5ff', '#9fe0dbff', '#afe0b1ff',
    '#f0c1b2ff', '#f0b2c1ff', '#b2f0c1ff', '#b2c1f0ff', '#c1b2f0ff',
    '#f0b2b2ff', '#b2f0f0ff', '#b2b2f0ff',
  ];

  icons = [
    'breakfast_dining', 'free_breakfast', 'bakery_dining', 'brunch_dining', 'coffee',
    'coffee_maker', 'dining', 'dinner_dining', 'emoji_food_beverage', 'flatware',
    'local_dining', 'lunch_dining', 'rice_bowl', 'soup_kitchen', 'kebab_dining',
    'egg_alt', 'fastfood', 'set_meal', 'room_service', 'tapas', 'takeout_dining',
  ];

  selectedIcon = 'fastfood';
  selectedBackgroundColor = '#e62e2eff';

  ngOnInit(): void {

    this.editCategoryForm = this.fb.group({
      active: [true],
      categoryName: ['',
        {
          validators: [Validators.required, Validators.maxLength(50)],
          asyncValidators: [categoryNameDuplicateValidator(this.menuCategoryService)],
          updateOn: 'change'
        }],
      secondLanguageName: ['', {
        validators: [Validators.maxLength(50)],
        updateOn: 'change'
      }],
      parentCategoryId: [null, [this.parentCategoryValidator.bind(this)]],
      description: ['', {
        validators: [Validators.maxLength(100)],
        updateOn: 'change'
      }],
      reference: ['', {
        validators: [Validators.maxLength(50)],
        updateOn: 'change'
      }],
      image: [null],
      icon: [this.selectedIcon],
      backgroundColor: [this.selectedBackgroundColor],
      withProducts: [false],
      schedule: [],
      item: [0],
      webShop: [false],
      aggregator: [false],
      kiosk: [false],
      counterTop: [false],
      created_at: [new Date()]
    });
  }

  parentCategoryValidator(control: AbstractControl): ValidationErrors | null {
    const inputValue = control.value;
    if (!inputValue) return null;

    const isValid = this.listOfCategory.some(option =>
      (typeof inputValue === 'object' && inputValue?.categoryId === option.categoryId) ||
      (typeof inputValue === 'string' && inputValue.toLowerCase() === option.categoryName.toLowerCase())
    );

    return isValid ? null : { invalidSelection: true };
  }

}
