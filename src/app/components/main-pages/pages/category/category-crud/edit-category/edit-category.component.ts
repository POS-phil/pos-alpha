import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, SecurityContext, signal, Signal, viewChild, WritableSignal } from '@angular/core';
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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UploadImageComponent } from '../../../../../dialogs/upload-image/upload-image.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuCategoryAvailabilityComponent } from '../../../../../dialogs/menu-category-availability/menu-category-availability.component';
import { MatChipsModule } from '@angular/material/chips';
import { MenuCategories, ScheduleEntry } from '../../../../../../common/categories';
import { MenuCategoriesService } from '../../../../../../service/api/menu-categories/menu-categories.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError, combineLatest, debounceTime, map, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { NotificationService } from '../../../../../../service/notifications/notification.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { CategoryIdAndName } from '../../../../../../common/categories';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckbox } from '@angular/material/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { Message } from 'primeng/message';
import { MatRadioModule } from '@angular/material/radio';

export function categoryNameDuplicateValidator(service: MenuCategoriesService, originalName?: string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    // If editing and value = original, skip validation
    if (originalName && control.value.trim().toLowerCase() === originalName.trim().toLowerCase()) {
      return of(null);
    }

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

//pastDateTimeValidator for editing only
export function pastDateTimeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const selected = control.value instanceof Date
      ? control.value
      : new Date(control.value);

    const now = new Date();

    return selected.getTime() <= now.getTime() ? { pastDateTime: true } : null;
  };
}

export function beforeActivationValidator(activationControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !activationControl.value) return null;

    const activationDate = activationControl.value instanceof Date
      ? activationControl.value
      : new Date(activationControl.value);

    const deactivationDate = control.value instanceof Date
      ? control.value
      : new Date(control.value);

    // Trigger error if deactivation is before or exactly equal to activation
    return deactivationDate.getTime() <= activationDate.getTime() ? { beforeActivation: true } : null;
  };
}

function convertDubaiToLocal(dateString: string): Date {
  if (!dateString) return new Date();

  // Parse the string as Dubai time (UTC+4)
  const dubaiOffset = 4 * 60; // Dubai is UTC+4, in minutes
  const [datePart, timePart] = dateString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);

  // Create Date object in UTC
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour - dubaiOffset / 60, minute, second));

  return utcDate; // this is now in browser local time
}

export function parentCategoryAsyncValidator(component: EditCategoryComponent): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    //console.log('Validator triggered, value =', control.value);

    if (!control.value) {
      //console.log('No value, skipping');
      return of(null);
    }

    let parentId: number | null = null;

    if (typeof control.value === 'object') {
      parentId = control.value.categoryId ?? null;
    }

    if (!parentId && typeof control.value === 'string') {
      const found = component.listOfCategory.find(
        c => c.categoryName.toLowerCase() === control.value.toLowerCase()
      );
      parentId = found?.categoryId ?? null;
    }

    if (!parentId) {
      //console.log('Invalid input, skipping');
      return of({ invalidSelection: true });
    }

    //console.log('Calling backend for parentId', parentId, 'categoryId', component.categoryId());

    return component.menuCategoryService.validateParent(component.categoryId(), parentId)
      .pipe(
        map(res => {
          //console.log('Backend result', res);
          return res.valid ? null : { invalidParent: true };
        }),
        catchError(err => {
          console.error('Validator error', err);
          return of(null);
        })
      );
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
    AsyncPipe,
    Breadcrumb,
    MatExpansionModule,
    MatChipsModule,
    MatDividerModule,
    MatCheckbox,
    DatePicker,
    Message,
    MatRadioModule

  ],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss',
  providers: [MenuCategoriesService, NotificationService],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EditCategoryComponent implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef,
    public menuCategoryService: MenuCategoriesService,
    private fb: FormBuilder,
    private route: Router,
    private sanitizer: DomSanitizer,
    private router: ActivatedRoute,
    private notification: NotificationService,
  ) { }

  selectedIcon?: string;
  selectedBackgroundColor = '#e62e2eff';
  previewImage: string | SafeUrl | null = null;
  selectedImage: string | File | null = null;
  listOfCategory: CategoryIdAndName[] = [];
  filteredCategories: CategoryIdAndName[] = [];
  private categoriesSubject = new BehaviorSubject<CategoryIdAndName[]>([]);
  filteredCategories$!: Observable<CategoryIdAndName[]>;
  editCategoryForm!: FormGroup;

  private destroy$ = new Subject<void>();

  categoryId: WritableSignal<number> = signal(0);
  _categoryName: WritableSignal<string> = signal('');
  today: Date = new Date();

  accordion = viewChild.required(MatAccordion);

  currentSchedule: ScheduleEntry[] = []

  items: MenuItem[] | undefined;

  currentdateStartOnly: Date | null = null;
  currentdateActivation: Date | null = null;
  currentdateDeactivation: Date | null = null;



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

  get isActive() {
    return this.editCategoryForm.get('isActive') as FormControl;
  }

  get categoryName() {
    return this.editCategoryForm.get('categoryName') as FormControl;
  }

  get secondLanguageName() {
    return this.editCategoryForm.get('secondLanguageName') as FormControl;
  }

  get description() {
    return this.editCategoryForm.get('description') as FormControl;
  }

  get reference() {
    return this.editCategoryForm.get('reference') as FormControl;
  }

  get isTimedActivation() {
    return this.editCategoryForm.get('isTimedActivation') as FormControl;
  }

  get autoActivated() {
    return this.editCategoryForm.get('autoActivated') as FormControl;
  }

  get selectedScheduleMode() {
    return this.editCategoryForm.get('selectedScheduleMode') as FormControl;
  }

  get dateStartOnly() {
    return this.editCategoryForm.get('dateStartOnly') as FormControl;
  }

  get dateActivation() {
    return this.editCategoryForm.get('dateActivation') as FormControl;
  }

  get dateDeactivation() {
    return this.editCategoryForm.get('dateDeactivation') as FormControl;
  }

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);

    this.editCategoryForm = this.fb.group({
      isActive: [''],
      categoryName: ['',
        {
          validators: [Validators.required, Validators.maxLength(50)],
          asyncValidators: [categoryNameDuplicateValidator(this.menuCategoryService, this._categoryName())],
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
      backgroundColor: [this.selectedBackgroundColor],
      //withProducts: [false],
      schedule: this.fb.control<ScheduleEntry[]>([]),
      //item: [0],
      webShop: [false],
      aggregator: [false],
      kiosk: [false],
      counterTop: [false],
      isTimedActivation: [false],
      //AUTOMATION
      autoActivated: [false],
      selectedScheduleMode: [{ value: null, disabled: true }],
      dateStartOnly: [{ value: null, disabled: true }],
      dateActivation: [{ value: null, disabled: true }],
      dateDeactivation: [{ value: null, disabled: true }],
      //created_at: [new Date()]
    });

    this.router.params.subscribe(params => {
      const categoryId = +params['categoryId'];
      this.menuCategoryService.getCategory(categoryId).subscribe({
        next: (category: MenuCategories) => {
          this.items = [
            { label: 'Categories', routerLink: '/product-list/category' },
            { label: 'Edit Categoy' },
            { label: category.categoryName }
          ]
          this.populateForm(category);
          this.currentdateStartOnly = typeof category.dateStartOnly === 'string'
            ? convertDubaiToLocal(category.dateStartOnly)
            : category.dateStartOnly instanceof Date
              ? category.dateStartOnly
              : null;
          this.currentdateActivation = typeof category.dateActivation === 'string'
            ? convertDubaiToLocal(category.dateActivation)
            : category.dateActivation instanceof Date
              ? category.dateActivation
              : null;
          this.currentdateDeactivation = typeof category.dateDeactivation === 'string'
            ? convertDubaiToLocal(category.dateDeactivation)
            : category.dateDeactivation instanceof Date
              ? category.dateDeactivation
              : null;

          //console.log('Category data loaded:', category);
          //console.log('Category data loaded isActive:', category.isActive);
          //combine Latest for edit only
          combineLatest([
            this.editCategoryForm.get('isTimedActivation')!.valueChanges.pipe(startWith(this.editCategoryForm.get('isTimedActivation')!.value)),
            this.editCategoryForm.get('selectedScheduleMode')!.valueChanges.pipe(startWith(this.editCategoryForm.get('selectedScheduleMode')!.value)),
            this.editCategoryForm.get('autoActivated')!.valueChanges.pipe(startWith(this.editCategoryForm.get('autoActivated')!.value)),
            this.editCategoryForm.get('dateStartOnly')!.valueChanges.pipe(startWith(this.editCategoryForm.get('dateStartOnly')!.value)),
            this.editCategoryForm.get('dateActivation')!.valueChanges.pipe(startWith(this.editCategoryForm.get('dateActivation')!.value)),
            this.editCategoryForm.get('dateDeactivation')!.valueChanges.pipe(startWith(this.editCategoryForm.get('dateDeactivation')!.value)),
            // this.editCategoryForm.get('isActive')!.valueChanges.pipe(
            //   startWith(this.editCategoryForm.get('isActive')!.value)
            // )
            this.editCategoryForm.get('isActive')!.valueChanges.pipe(startWith(this.editCategoryForm.get('isActive')!.value)),
          ]).subscribe(() => {
            this.dateValidator();
            this.updateTimedActivationControls();
            this.cdr.markForCheck();
          });
        }
      })
    });

    this.isActive.valueChanges.subscribe((val) => {
      // Only cancel auto if autoActivated was true AND this is a manual toggle
      if (this.autoActivated.value) {
        this.autoActivated.setValue(false, { emitEvent: false }),
        this.isTimedActivation.setValue(false, { emitEvent: false})
      }
    });

    this.filteredCategories = this.listOfCategory.slice();

    this.filteredCategories$ = combineLatest([
      this.categoriesSubject.asObservable(),
      this.editCategoryForm.get('parentCategoryId')!.valueChanges.pipe(
        startWith('')
      )
    ]).pipe(
      map(([categories, value]) => {
        const name = typeof value === 'string' ? value : value?.categoryName;
        return name ? this._filterCategories(name, categories) : categories;
      })
    );

    this.editCategoryForm.get('parentCategoryId')?.setAsyncValidators(
      parentCategoryAsyncValidator(this)
    );
    this.editCategoryForm.get('parentCategoryId')?.updateValueAndValidity({ emitEvent: true });

    this.getListOfCategories();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //POPULATE FORM

  populateForm(category: MenuCategories) {
    this.categoryId.set(category.categoryId || 0);
    this._categoryName.set(category.categoryName);

    this.categoryName.setValidators([Validators.required, Validators.maxLength(50)]);
    this.categoryName.setAsyncValidators([
      categoryNameDuplicateValidator(this.menuCategoryService, category.categoryName)
    ]);
    this.categoryName.updateValueAndValidity({ emitEvent: false });

    const parentCategory = this.listOfCategory.find(
      c => c.categoryId === category.parentCategoryId
    ) || null;

    this.selectedIcon = category.icon;
    this.currentSchedule = category.schedule || [];
    this.scheduleSummary = this.generateScheduleSummary(this.currentSchedule);
    this.selectedBackgroundColor = category.backgroundColor || '#e62e2eff';
    this.selectedImage = (category.image && typeof category.image === 'string') ? category.image : null;
    this.previewImage = (category.image && typeof category.image === 'string')
      ? this.sanitizer.bypassSecurityTrustUrl(category.image)
      : null;

    const allDays = this.currentSchedule.every(d => d.available);
    this.isAllDaysChecked.set(allDays);
    this.isAllDayChecked.set(allDays);

    //const activationRange = category.timedActivationRange?.map(d => new Date(d)) || null;


    this.editCategoryForm.patchValue({
      isActive: category.isActive,
      categoryName: category.categoryName,
      secondLanguageName: category.secondLanguageName,
      description: category.description,
      reference: category.reference,
      parentCategoryId: parentCategory,
      schedule: this.currentSchedule,
      webShop: category.webShop,
      aggregator: category.aggregator,
      kiosk: category.kiosk,
      counterTop: category.counterTop,
      icon: category.icon,
      isTimedActivation: category.isTimedActivation,
      autoActivated: category.autoActivated,
      selectedScheduleMode: category.selectedScheduleMode?.toString(),
      dateStartOnly: typeof category.dateStartOnly === 'string'
        ? convertDubaiToLocal(category.dateStartOnly)
        : category.dateStartOnly instanceof Date
          ? category.dateStartOnly
          : null,
      dateActivation: typeof category.dateActivation === 'string'
        ? convertDubaiToLocal(category.dateActivation)
        : category.dateActivation instanceof Date
          ? category.dateActivation
          : null,
      dateDeactivation: typeof category.dateDeactivation === 'string'
        ? convertDubaiToLocal(category.dateDeactivation)
        : category.dateDeactivation instanceof Date
          ? category.dateDeactivation
          : null,
    });
  }

  dateValidator() {

    if (this.isTimedActivation!.value == true) {
      if (this.selectedScheduleMode.value === '1') {
        this.dateStartOnly.setValidators([Validators.required, pastDateTimeValidator()]);
        this.dateActivation.clearValidators();
        this.dateDeactivation.clearValidators();

      } else {
        this.dateActivation.setValidators([Validators.required, pastDateTimeValidator()]);
        this.dateDeactivation.setValidators([Validators.required, pastDateTimeValidator(), beforeActivationValidator(this.dateActivation)]);
        this.dateStartOnly.clearValidators();
      }
    } else {
      this.dateStartOnly.clearValidators();
      this.dateActivation.clearValidators();
      this.dateDeactivation.clearValidators();
    }

    this.dateStartOnly.updateValueAndValidity({ emitEvent: false });
    this.dateActivation.updateValueAndValidity({ emitEvent: false });
    this.dateDeactivation.updateValueAndValidity({ emitEvent: false });
  }

  private checkCurrentDateAndSelectedDate() {
    if (
      (this.currentdateStartOnly && this.dateStartOnly.value && this.currentdateStartOnly.getTime() === new Date(this.dateStartOnly.value).getTime()) ||
      (this.currentdateActivation && this.dateActivation.value && this.currentdateActivation.getTime() === new Date(this.dateActivation.value).getTime()) ||
      (this.currentdateDeactivation && this.dateDeactivation.value && this.currentdateDeactivation.getTime() === new Date(this.dateDeactivation.value).getTime())
    ) {
      //console.log(this.currentdateStartOnly, this.dateStartOnly.value);
      this.isActive.setValue(true);
      //console.log(this.isActive.value);
    } else {
      this.isActive.setValue(false);
    }
  }

  private updateTimedActivationControls() {

    if (this.autoActivated.value) {
      if (this.isActive.value) {
        this.isTimedActivation.disable({emitEvent:false});
        this.selectedScheduleMode.disable({ emitEvent: false });
        this.dateStartOnly.disable({ emitEvent: false });
        this.dateActivation.disable({ emitEvent: false });
        this.dateDeactivation.disable({ emitEvent: false });
      } else {
        if (this.isTimedActivation!.value == true) {
          this.autoActivated.setValue(true, { emitEvent: false })
          this.selectedScheduleMode.enable({ emitEvent: false });
          if (this.selectedScheduleMode!.value === '1') {
            this.dateStartOnly.enable({ emitEvent: false });
            this.dateActivation.disable({ emitEvent: false });
            this.dateActivation.setValue(null, { emitEvent: false });
            this.dateDeactivation.disable({ emitEvent: false });
            this.dateDeactivation.setValue(null, { emitEvent: false });
          } else {
            this.isActive.setValue(false, { emitEvent: false });
            this.dateStartOnly.disable({ emitEvent: false });
            this.dateStartOnly.setValue(null, { emitEvent: false });
            this.dateActivation.enable({ emitEvent: false });
            this.dateDeactivation.enable({ emitEvent: false });
          }
        } else {
          this.autoActivated.setValue(false, { emitEvent: false })
          this.selectedScheduleMode.disable({ emitEvent: false });
          this.dateStartOnly.disable({ emitEvent: false });
          this.dateStartOnly.setValue(null, { emitEvent: false });
          this.dateActivation.disable({ emitEvent: false });
          this.dateActivation.setValue(null, { emitEvent: false });
          this.dateDeactivation.disable({ emitEvent: false });
          this.dateDeactivation.setValue(null, { emitEvent: false });
        }
      }
    } else {
      if (this.isActive.value) {
        this.isTimedActivation.disable({ emitEvent: false })
        this.autoActivated.setValue(false, { emitEvent: false });
        this.selectedScheduleMode.disable({ emitEvent: false });
        this.dateStartOnly.disable({ emitEvent: false });
        this.dateStartOnly.setValue(null, { emitEvent: false });
        this.dateActivation.disable({ emitEvent: false });
        this.dateActivation.setValue(null, { emitEvent: false });
        this.dateDeactivation.disable({ emitEvent: false });
        this.dateDeactivation.setValue(null, { emitEvent: false });
      } else {
        this.isTimedActivation.enable({ emitEvent: false })
        if (this.isTimedActivation!.value == true) {
          this.autoActivated.setValue(true, { emitEvent: false });
          this.selectedScheduleMode.enable({ emitEvent: false });
          if (this.selectedScheduleMode!.value === '1') {
            this.dateStartOnly.enable({ emitEvent: false });
            this.dateActivation.disable({ emitEvent: false });
            this.dateActivation.setValue(null, { emitEvent: false });
            this.dateDeactivation.disable({ emitEvent: false });
            this.dateDeactivation.setValue(null, { emitEvent: false });
          } else {
            this.isActive.setValue(false, { emitEvent: false });
            this.dateStartOnly.disable({ emitEvent: false });
            this.dateStartOnly.setValue(null, { emitEvent: false });
            this.dateActivation.enable({ emitEvent: false });
            this.dateDeactivation.enable({ emitEvent: false });
          }
        }
      }
    }

  }

  //PARENT CATEGORY

  getListOfCategories() {
    this.menuCategoryService.getMenuCategoryIdAndName().subscribe({
      next: (data: CategoryIdAndName[]) => {
        this.listOfCategory = data;
        this.categoriesSubject.next(data);
        this.editCategoryForm.get('parentCategoryId')?.updateValueAndValidity();
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

  parentCategoryValidator(control: AbstractControl): ValidationErrors | null {
    const inputValue = control.value;
    if (!inputValue) return null;

    const isValid = this.listOfCategory.some(option =>
      (typeof inputValue === 'object' && inputValue?.categoryId === option.categoryId) ||
      (typeof inputValue === 'string' && inputValue.toLowerCase() === option.categoryName.toLowerCase())
    );

    return isValid ? null : { invalidSelection: true };
  }

  getDescendants(id: number): number[] {
    const result: number[] = [];
    const stack = [id];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const children = this.listOfCategory.filter(c => c.parentCategoryId === current);
      for (const child of children) {
        if (!result.includes(child.categoryId ?? 0)) {
          result.push(child.categoryId ?? 0);
          stack.push(child.categoryId ?? 0);
        }
      }
    }
    return result;
  }

  private getSubtreeHeight(categoryId: number): number {
    let maxDepth = 0;
    const stack = [{ id: categoryId, depth: 0 }];

    while (stack.length > 0) {
      const { id, depth } = stack.pop()!;
      maxDepth = Math.max(maxDepth, depth);

      const children = this.listOfCategory.filter(c => c.parentCategoryId === id);
      for (const child of children) {
        if (typeof child.categoryId === 'number') {
          stack.push({ id: child.categoryId, depth: depth + 1 });
        }
      }
    }

    return maxDepth;
  }


  selectIcon(icon: string) {
    this.selectedIcon = icon;
    this.editCategoryForm.patchValue({ icon });
  }

  selectBackgroundColor(backgroundColor: string) {
    this.selectedBackgroundColor = backgroundColor;
    this.editCategoryForm.patchValue({ backgroundColor })
  }

  displayCategoryName(category: CategoryIdAndName): string {
    return category ? category.categoryName : '';
  }

  //SCHEDULE

  scheduleSummary: string[] = [];
  isAllDaysChecked = signal(true);
  isAllDayChecked = signal(true);
  allDayStartTime = signal<string>('00:00');
  allDayEndTime = signal<string>('23:59');

  readonly dialog = inject(MatDialog);

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

  openAvailabilityDialog(): void {
    const dialogRef = this.dialog.open(MenuCategoryAvailabilityComponent, {
      width: '500px',
      height: '550px',
      data: {
        schedule: this.editCategoryForm.get('schedule')?.value || [],
        isAllDaysChecked: this.isAllDaysChecked(),
        isAllDayChecked: this.isAllDayChecked(),
        allDayStartTime: this.allDayStartTime(),
        allDayEndTime: this.allDayEndTime()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editCategoryForm.get('schedule')?.setValue(result.schedule);
        this.isAllDaysChecked.set(result.isAllDaysChecked);
        this.isAllDayChecked.set(result.isAllDayChecked);
        this.scheduleSummary = this.generateScheduleSummary(result.schedule);
        this.allDayStartTime.set(result.allDayStartTime);
        this.allDayEndTime.set(result.allDayEndTime);
      }
    });
  }

  //IMAGE

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

  private cleanUpObjectUrl(): void {
    if (this.previewImage) {
      const unsafeUrl = this.sanitizer.sanitize(SecurityContext.URL, this.previewImage);
      if (unsafeUrl) {
        window.URL.revokeObjectURL(unsafeUrl);
      }
      this.previewImage = null;
    }
  }

  updateCategory() {

    if (this.editCategoryForm.invalid) {
      this.editCategoryForm.markAllAsTouched();
      return;
    }

    const formValue = this.editCategoryForm.value;

    formValue.dateStartOnly = this.toDubaiISOString(formValue.dateStartOnly);
    formValue.dateActivation = this.toDubaiISOString(formValue.dateActivation);
    formValue.dateDeactivation = this.toDubaiISOString(formValue.dateDeactivation);

    if (formValue.parentCategoryId && typeof formValue.parentCategoryId === 'object') {
      formValue.parentCategoryId = formValue.parentCategoryId.categoryId;
    }

    // --- Convert timedActivationRange to backend-friendly format ---
    if (formValue.timedActivationRange) {
      formValue.timedActivationRange = formValue.timedActivationRange.map((d: Date) => {
        const date = new Date(d);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T00:00:00`;
      });
    }

    const formData = new FormData();
    formData.append('category', new Blob([JSON.stringify(formValue)], { type: 'application/json' }));

    if (this.selectedImage instanceof File) {
      // new file uploaded
      formData.append('image', this.selectedImage);
    } else if (this.selectedImage === null) {
      // user removed the image
      formData.append('removeImage', 'true');
    }

    //Uncomment for debugging
    // console.log("image : " + this.selectedImage);
    // console.log('Form Data:', formData);
    // console.log('Form Value:', formValue);
    // console.log('Category Form', this.editCategoryForm.value);
    // console.log('Category ID:', this.categoryId());

    this.menuCategoryService.updateCategory(formData, this.categoryId()).subscribe({
      next: (response) => {
        this.notification.success(response);
        this.route.navigate(['/product-list/category']);
      },
      error: (err) => {
        let msg = 'Something went wrong';
        if (err.error) {
          try {
            const parsed = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
            msg = parsed.message || msg;
          } catch {
            msg = err.error; // fallback if JSON.parse fails
          }
        }
        this.notification.info(msg);
      }
    });
  }

  isInvalid(controlName: string) {
    const control = this.editCategoryForm.get(controlName);
    return control?.invalid && (control.touched || this.editCategoryForm);
  }

  private toDubaiISOString(date: Date | null): string | null {
    if (!date) return null;

    // Convert to Dubai time string
    return date.toLocaleString('sv-SE', { timeZone: 'Asia/Dubai' }).replace(' ', 'T');
  }
}
