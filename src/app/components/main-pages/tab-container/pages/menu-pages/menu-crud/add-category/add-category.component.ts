import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, SecurityContext, signal, Signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { UploadImageComponent } from '../../../../../../dialogs/upload-image/upload-image.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuCategoryAvailabilityComponent } from '../../../../../../dialogs/menu-category-availability/menu-category-availability.component';
import { MatChipsModule } from '@angular/material/chips';
import { ScheduleEntry } from '../../../../../../../common/menu-categories';
import { MenuCategoriesService } from '../../../../../../../service/api/menu-categories/menu-categories.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule
  ],
  providers: [MenuCategoriesService],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
})
export class AddCategoryComponent implements OnInit {

  private _createCategorySuccess = inject(MatSnackBar);

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

  selectIcon(icon: string) {
    this.selectedIcon = icon;
    this.createCategoryForm.patchValue({ icon });
  }

  selectBackgroundColor(color: string) {
    this.selectedBackgroundColor = color;
  }

  createCategoryForm!: FormGroup;

  readonly dialog = inject(MatDialog);

  previewImage: SafeUrl | null = null;
  selectedImage: File | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private menuCategoryService: MenuCategoriesService,
    private fb: FormBuilder,
    private route: Router,
    private sanitizer: DomSanitizer,
  ) { }

  get categoryName() {
    return this.createCategoryForm.get('categoryName')!;
  }

  ngOnInit(): void {

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
      categoryName: ['', Validators.required],
      secondLanguageName: [''],
      description: [''],
      reference: [''],
      //schedule: this.fb.control<ScheduleEntry[]>(defaultSchedule),
      image: [null],
      icon: [this.selectedIcon],
      background: [this.selectedBackgroundColor],
      withProducts: [false],
      withSubCategories: [false],
      schedule: [defaultSchedule],
      item: [0],
      webShop: [false],
      aggregator: [false],
      kiosk: [false],
      counterTop: [false],
      created_at: [new Date()]
    });

    this.scheduleSummary = this.generateScheduleSummary(defaultSchedule);
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

    const formData = new FormData();
    formData.append('category', new Blob([JSON.stringify(formValue)], { type: 'application/json' }));

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    // Uncomment for debugging
    // console.log('Form Data:', formData);
    // console.log('Form Value:', formValue);
    // console.log('Category Form', this.createCategoryForm.value);

    this.menuCategoryService.createCategory(formData).subscribe({
      next: (response) => {
        console.log('Category created:', response);
        this.cleanUpObjectUrl();

        const snackBarRef = this._createCategorySuccess.open(
          `Category "${this.categoryName}" created successfully`,
          'Close',
          { duration: 5000 }
        );

        setTimeout(() => {
          this.route.navigate(['/menu/categories']);
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
