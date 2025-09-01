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
    MatMenuModule,
    MatTooltipModule,
    MatChipsModule,
    MatSnackBarModule,
    AsyncPipe,
    Breadcrumb
  ],
  providers: [MenuCategoriesService, NotificationService],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
})
export class AddCategoryComponent implements OnInit {

  scheduleSummary: string[] = [];
  isAllDaysChecked = signal(true);
  isAllDayChecked = signal(true);
  allDayStartTime = signal<string>('00:00');
  allDayEndTime = signal<string>('23:59');

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
  previewImage: SafeUrl | null = null;
  selectedImage: File | null = null;
  listOfCategory: CategoryIdAndName[] = [];
  filteredCategories: CategoryIdAndName[] = [];
  private categoriesSubject = new BehaviorSubject<CategoryIdAndName[]>([]);
  filteredCategories$!: Observable<CategoryIdAndName[]>;

  selectIcon(icon: string) {
    this.selectedIcon = icon;
    this.createCategoryForm.patchValue({ icon });
  }

  selectBackgroundColor(backgroundColor: string) {
    this.selectedBackgroundColor = backgroundColor;
    this.createCategoryForm.patchValue({ backgroundColor })
  }

  createCategoryForm!: FormGroup;

  readonly dialog = inject(MatDialog);

  constructor(
    private cdr: ChangeDetectorRef,
    private menuCategoryService: MenuCategoriesService,
    private fb: FormBuilder,
    private route: Router,
    private sanitizer: DomSanitizer,
    private notification: NotificationService,
  ) { }

  get categoryName() {
    return this.createCategoryForm.get('categoryName')!;
  }

  get secondLanguageName() {
    return this.createCategoryForm.get('secondLanguageName')
  }

  get description() {
    return this.createCategoryForm.get('description');
  }

  get reference() {
    return this.createCategoryForm.get('reference');
  }

  items: MenuItem[] | undefined;

  ngOnInit(): void {

    this.items = [
      { label: 'Categories', routerLink: '/product-list/category' },
      { label: 'Add Categoy' }
    ]

    const defaultSchedule: ScheduleEntry[] = [
      { day: 'sunday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
      { day: 'monday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
      { day: 'tuesday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
      { day: 'wednesday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
      { day: 'thursday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
      { day: 'friday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
      { day: 'saturday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
    ];

    this.createCategoryForm = this.fb.group({
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
        validators: [Validators.maxLength(500)],
        updateOn: 'change'
      }],
      reference: ['', {
        validators: [Validators.maxLength(50)],
        updateOn: 'change'
      }],
      image: [null],
      icon: [this.selectedIcon],
      backgroundColor: [''],
      withProducts: [false],
      schedule: [defaultSchedule],
      item: [0],
      webShop: [false],
      aggregator: [false],
      kiosk: [false],
      counterTop: [false],
      created_at: [new Date()]
    });

    this.scheduleSummary = this.generateScheduleSummary(defaultSchedule);
    this.filteredCategories = this.listOfCategory.slice();

    this.filteredCategories$ = combineLatest([
      this.categoriesSubject.asObservable(),
      this.createCategoryForm.get('parentCategoryId')!.valueChanges.pipe(
        startWith('')
      )
    ]).pipe(
      map(([categories, value]) => {
        const name = typeof value === 'string' ? value : value?.categoryName;
        return name ? this._filterCategories(name, categories) : categories;
      })
    );

    this.getListOfCategories();

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

  onAutocompleteBlur() {
  const control = this.createCategoryForm.get('parentCategoryId');
  if (control?.value && typeof control.value === 'string') {
    control.setValue(null); 
    control.setErrors({ invalidSelection: true });
  }
}

  getListOfCategories() {
    this.menuCategoryService.getMenuCategoryIdAndName().subscribe({
      next: (data: CategoryIdAndName[]) => {
        this.listOfCategory = data;
        this.categoriesSubject.next(data);
        //console.log(data);
      },
      error: (error) => {
        console.error('Error fetching list categories', error);
      }
    });
  }

  private _filterCategories(name: string, categories: CategoryIdAndName[]): CategoryIdAndName[] {
    const filterValue = name.toLowerCase();
    return categories.filter(option =>
      option.categoryName.toLowerCase().includes(filterValue)
    );
  }

  displayCategoryName(category: CategoryIdAndName): string {
    return category ? category.categoryName : '';
  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(UploadImageComponent, {
      width: '800px',
      height: '650px',
      maxWidth: '150vw',
      maxHeight: '190vh',
      data: {
        previewImage: this.previewImage,
        selectedImage: this.selectedImage
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.previewImage = result.previewImage;
        this.selectedImage = result.selectedImage;
      }
    });

    dialogRef.componentInstance.imageRemoved.subscribe(() => {
      this.previewImage = null;
      this.selectedImage = null;
      this.cleanUpObjectUrl();
      this.cdr.detectChanges();
    });

  };

  openAvailabilityDialog(): void {
    const dialogRef = this.dialog.open(MenuCategoryAvailabilityComponent, {
      width: '500px',
      height: '550px',
      data: {
        schedule: this.createCategoryForm.get('schedule')?.value || [],
        isAllDaysChecked: this.isAllDaysChecked(),
        isAllDayChecked: this.isAllDayChecked(),
        allDayStartTime: this.allDayStartTime(),
        allDayEndTime: this.allDayEndTime()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createCategoryForm.get('schedule')?.setValue(result.schedule);
        this.isAllDaysChecked.set(result.isAllDaysChecked);
        this.isAllDayChecked.set(result.isAllDayChecked);
        this.scheduleSummary = this.generateScheduleSummary(result.schedule);
        this.allDayStartTime.set(result.allDayStartTime);
        this.allDayEndTime.set(result.allDayEndTime);
      }
    });
  }

  generateScheduleSummary(schedule: ScheduleEntry[]): string[] {
    const days = schedule.filter(d => d.day.toLowerCase() !== 'all days'); // optional filter

    const allAvailable = days.every(d => d.available);
    const sameAllDay = days.every(d => d.allDay === days[0].allDay);
    const sameStart = days.every(d => d.startTime === days[0].startTime);
    const sameEnd = days.every(d => d.endTime === days[0].endTime);

    if (allAvailable && sameAllDay && sameStart && sameEnd) {
      const start = this.formatTime(days[0].startTime || '00:00');
      const end = this.formatTime(days[0].endTime || '23:59');
      return [`All Days : ${start} - ${end}`];
    }

    return days
      .filter(day => day.available)
      .map(day => {
        const start = this.formatTime(day.startTime || '00:00');
        const end = this.formatTime(day.endTime || '23:59');
        return `${this.capitalize(day.day)} : ${start} - ${end}`;
      });
  }

  formatTime(time: string): string {
    const [hourStr, minute] = time.split(':');
    let hour = +hourStr;
    const suffix = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute}${suffix}`;
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  private cleanUpObjectUrl(): void {
    if (this.previewImage) {
      const unsafeUrl = this.sanitizer.sanitize(SecurityContext.URL, this.previewImage);
      if (unsafeUrl) {
        window.URL.revokeObjectURL(unsafeUrl);
      }
      this.previewImage = null;
    }
  }

  createCategory(): void {
    if (this.createCategoryForm.invalid) {
      this.createCategoryForm.markAllAsTouched();
      return;
    }

    const formValue = this.createCategoryForm.value;

    if (formValue.parentCategoryId && typeof formValue.parentCategoryId === 'object') {
      formValue.parentCategoryId = formValue.parentCategoryId.categoryId;
    }

    const formData = new FormData();
    formData.append('category', new Blob([JSON.stringify(formValue)], { type: 'application/json' }));

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    //Uncomment for debugging
    //console.log('Form Data:', formData);
    //console.log('Form Value:', formValue);
    //console.log('Category Form', this.createCategoryForm.value);

    this.menuCategoryService.createCategory(formData).subscribe({
      next: (response) => {
        //console.log('Category created:', response);
        this.cleanUpObjectUrl();

        this.notification.success(this.createCategoryForm.value.categoryName + " created successfully")

        setTimeout(() => {
          this.route.navigate(['/product-list/category']);
        }, 100);
      },
      error: (err) => {
        console.error('Error creating category', err);
        if (err.error) {
          console.error('Server error:', err.error);
        }
      }
    });
  }

}
