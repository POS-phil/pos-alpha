import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, Signal } from '@angular/core';
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
import { SafeUrl } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuCategoryAvailabilityComponent } from '../../../../../../dialogs/menu-category-availability/menu-category-availability.component';
import { MatChipsModule } from '@angular/material/chips';
import { ScheduleEntry } from '../../../../../../../common/menu-categories';
import { MenuCategoriesService } from '../../../../../../../service/api/menu-categories/menu-categories.service';
import { HttpClient } from '@angular/common/http';

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
    MatChipsModule
  ],
  providers: [MenuCategoriesService],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
})
export class AddCategoryComponent implements OnInit {

  scheduleSummary: string[] = [];
  isAllDaysChecked = signal(true);
  isAllDayChecked = signal(true);
  allDayStartTime = signal<string>('00:00');
  allDayEndTime = signal<string>('23:59');

  web_shop = false;
  aggregator = false;
  kiosk = false;
  counter_top = false;

  icons = [
    'breakfast_dining', 'free_breakfast', 'bakery_dining', 'brunch_dining', 'coffee',
    'coffee_maker', 'dining', 'dinner_dining', 'emoji_food_beverage', 'flatware',
    'local_dining', 'lunch_dining', 'rice_bowl', 'soup_kitchen', 'kebab_dining',
    'egg_alt', 'fastfood', 'set_meal', 'room_service', 'tapas', 'takeout_dining',
  ];

  selectedIcon = 'fastfood';

  selectIcon(icon: string) {
    this.selectedIcon = icon;
    console.log('Selected icon:', this.selectedIcon);
  }

  createCategoryForm!: FormGroup;

  readonly dialog = inject(MatDialog);

  uploadedImage: SafeUrl | null = null;
  _uploadedImage: string | File | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    private menuCategoryService: MenuCategoriesService,
    private fb: FormBuilder,
    private route: Router
  ) { }

  get categoryName() {
    return this.createCategoryForm.get('category_name')!;
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
      category_name: ['', Validators.required],
      schedule: this.fb.control<ScheduleEntry[]>(defaultSchedule),
      web_shop: [false],
      aggregator: [false],
      kiosk: [false],
      counter_top: [false],
      created_at: [new Date()],
    });

    this.scheduleSummary = this.generateScheduleSummary(defaultSchedule);
  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(UploadImageComponent, {
      width: '800px',
      height: '650px',
      maxWidth: '150vw',
      maxHeight: '190vh',
      data: this.uploadedImage

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.uploadedImage = result;
        console.log('Image uploaded:', this.uploadedImage);
        this._uploadedImage = result;
      }
    });

    dialogRef.componentInstance.imageRemoved.subscribe(() => {
      this.uploadedImage = null;
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

  createCategory(): void {
    if (this.createCategoryForm.invalid) {
      this.createCategoryForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const formValue = this.createCategoryForm.value;

    // Prepare the DTO object
    const categoryDto = {
      reference: formValue.reference || "",
      category_name: formValue.category_name,
      isActive: true,
      withProducts: false,
      withSubCategories: false,
      icon: !this._uploadedImage ? this.selectedIcon : null,
      schedule: this.scheduleSummary,
      items: 0,
      web_shop: formValue.web_shop,
      aggregator: formValue.aggregator,
      kiosk: formValue.kiosk,
      counter_top: formValue.counter_top,
      last_order: null,
      created_at: new Date().toISOString()
    };

    // Append the DTO as JSON
    formData.append('dto', new Blob([JSON.stringify(categoryDto)], {
      type: 'application/json'
    }));

    // Append image file if exists
    if (this._uploadedImage instanceof File) {
      formData.append('image', this._uploadedImage, this._uploadedImage.name);
    } else if (typeof this._uploadedImage === 'string') {
      // If you need to handle base64 strings
      const byteString = atob(this._uploadedImage.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
      formData.append('image', blob, 'uploaded_image.jpg');
    }

    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.menuCategoryService.createCategory(formData).subscribe({
      next: (response) => {
        console.log('Category created:', response);
        this.route.navigate(['/menu/categories']);
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
