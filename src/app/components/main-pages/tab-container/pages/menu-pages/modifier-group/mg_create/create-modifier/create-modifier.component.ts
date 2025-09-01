import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { UploadImageComponent } from '../../../../../../../dialogs/upload-image/upload-image.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SafeUrl } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuCategoryAvailabilityComponent } from '../../../../../../../dialogs/menu-category-availability/menu-category-availability.component';
import { MatChipsModule } from '@angular/material/chips';
import { ScheduleEntry } from '../../../../../../../../common/menu-categories';


@Component({
  selector: 'app-create-modifier',
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
  templateUrl: './create-modifier.component.html',
  styleUrl: './create-modifier.component.scss'
})
export class CreateModifierComponent implements OnInit {

  scheduleSummary: string[] = [];

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
