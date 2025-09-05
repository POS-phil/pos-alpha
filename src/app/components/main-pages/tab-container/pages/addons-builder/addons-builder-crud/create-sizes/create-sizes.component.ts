import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, model, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { UploadImageComponent } from '../../../../../../dialogs/upload-image/upload-image.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SafeUrl } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuCategoryAvailabilityComponent } from '../../../../../../dialogs/menu-category-availability/menu-category-availability.component';
import { MatChipsModule } from '@angular/material/chips';
import { MenuCategories, ScheduleEntry } from '../../../../../../../common/menu-categories';
import { Sort,MatSortModule } from '@angular/material/sort';
import { createSize } from '../../../../../../../common/addons-builders';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-create-sizes',
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
    MatCheckboxModule,
    MatTableModule,
    MatSortModule
  ],
  templateUrl: './create-sizes.component.html',
  styleUrls: ['./create-sizes.component.scss']
})
export class CreateSizesComponent {

scheduleSummary: string[] = [];
  
  icons = [
    'breakfast_dining', 'free_breakfast', 'bakery_dining', 'brunch_dining', 'coffee',
    'coffee_maker', 'dining', 'dinner_dining', 'emoji_food_beverage', 'flatware',
    'local_dining', 'lunch_dining', 'rice_bowl', 'soup_kitchen', 'kebab_dining',
    'egg_alt', 'fastfood', 'set_meal', 'room_service', 'tapas', 'takeout_dining',
  ];

  selectedIcon = 'fastfood';
  private _liveAnnouncer: any;
  selectedBackgroundColor = '#e62e2eff';
  background_colors = [
    '#e62e2eff', '#2d30fcff', '#f2f53eff', '#5af845ff', '#35eefcff',
    '#f751eeff', '#a817ebff', '#ececd5ff', '#9fe0dbff', '#afe0b1ff',
    '#f0c1b2ff', '#f0b2c1ff', '#b2f0c1ff', '#b2c1f0ff', '#c1b2f0ff',
    '#f0b2b2ff', '#b2f0f0ff', '#b2b2f0ff',
  ];
previewImage: unknown;


  selectIcon(icon: string) {
    this.selectedIcon = icon;
  }
    selectBackgroundColor(backgroundColor: string) {
    this.selectedBackgroundColor = backgroundColor;
    this.createModifierForm.patchValue({ backgroundColor })
  }

  createModifierForm!: FormGroup;

  readonly dialog = inject(MatDialog);

  uploadedImage: SafeUrl | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }

  get categoryName() {
    return this.createModifierForm.get('category_name')!;
  }
  
  CreateSizeColumns: string[] = ['bulk'];
  CreateSizedisplayedColumns: string[] = ['name', 'sku', 'price', 'duplicate', 'isActive'];
  // Data source for the table
  CreateSizeList: createSize[] = [];
  CreateSize_DATA: any;
  ngOnInit(): void {

    const defaultSchedule: ScheduleEntry = {
      day: 'All Days',
      available: true,
      allDay: true,
      startTime: '00:00',
      endTime: '23:59',
      days: [
        { day: 'sunday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
        { day: 'monday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
        { day: 'tuesday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
        { day: 'wednesday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
        { day: 'thursday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
        { day: 'friday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
        { day: 'saturday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
      ]
    };


    this.createModifierForm = this.fb.group({
      category_name: ['', [Validators.required, Validators.maxLength(50)]],
      second_language: [''],
      reference: [''],
      schedule: this.fb.control<ScheduleEntry>(defaultSchedule),
      web_shop: [false],
      aggregator: [false],
      kiosk: [false],
      created_at: [new Date()],
    });

    this.scheduleSummary = this.generateScheduleSummary(defaultSchedule);
  }

  confirmCreate(): void {

  }
    getCategories() {
    this.CreateSize_DATA = new MatTableDataSource(this.CreateSizeList);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
      }
    });

    (dialogRef.componentInstance as UploadImageComponent).imageRemoved.subscribe(() => {
      this.uploadedImage = null;
      this.cdr.detectChanges();
    });

  };

  openAvailabilityDialog(): void {
    const dialogRef = this.dialog.open(MenuCategoryAvailabilityComponent, {
      width: '500px',
      height: '750px',
      maxWidth: '90vw',
      data: this.createModifierForm.get('schedule')?.value || []
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createModifierForm.get('schedule')?.setValue(result);
        this.scheduleSummary = this.generateScheduleSummary(result);
      }
    });
  }

  generateScheduleSummary(schedule: ScheduleEntry): string[] {
    const days = (schedule.days || []).filter((d: ScheduleEntry) => d.day !== 'All Days');

    const allAvailable = days.every((d: ScheduleEntry) => d.available);
    const sameAllDay = days.every((d: ScheduleEntry) => d.allDay === days[0].allDay);
    const sameStart = days.every((d: ScheduleEntry) => d.startTime === days[0].startTime);
    const sameEnd = days.every((d: ScheduleEntry) => d.endTime === days[0].endTime);

    if (allAvailable && sameAllDay && sameStart && sameEnd) {
      const start = this.formatTime(days[0].startTime || '00:00');
      const end = this.formatTime(days[0].endTime || '23:59');
      return [`All Days : ${start} - ${end}`];
    }

    return days
      .filter((day: ScheduleEntry) => day.available)
      .map((day: ScheduleEntry) => {
        const start = this.formatTime(day.startTime!);
        const end = this.formatTime(day.endTime!);
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
}
