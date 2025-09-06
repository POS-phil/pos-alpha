import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuPanel } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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


@Component({
  selector: 'app-create-item',
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
    MatNativeDateModule,
    MatCheckbox
],
providers: [  
  MatDatepickerModule,  
],

  templateUrl: './create-item.component.html',
  styleUrl: './create-item.component.scss'
})
//,MatDivider
export class CreateItemComponent implements OnInit {

  scheduleSummary: string[] = [];
  //itemName:string[] = [];
  secondLanguageName: [''] | undefined;
  isAllDaysChecked = signal(true);
  isAllDayChecked = signal(true);
  allDayStartTime = signal<string>('00:00');
  allDayEndTime = signal<string>('23:59');
  sTogglechecked = false;
  txtdisabled = false;

  icons = [
    'breakfast_dining', 'free_breakfast', 'bakery_dining', 'brunch_dining', 'coffee',
    'coffee_maker', 'dining', 'dinner_dining', 'emoji_food_beverage', 'flatware',
    'local_dining', 'lunch_dining', 'rice_bowl', 'soup_kitchen', 'kebab_dining',
    'egg_alt', 'fastfood', 'set_meal', 'room_service', 'tapas', 'takeout_dining',
  ];

selectedIcon = 'fastfood';
matDatepicker = '';
picker: Date | undefined;
iconMenu: MatMenuPanel<any> | null | undefined;
background_colors: any;
selectedBackgroundColor: any;
previewImage: unknown;
listOfCategory: any;
displayCategoryName: ((value: any) => string) | null | undefined;
itemName: any;
startDate: unknown;
isEditable: false | undefined;
dateRangeValue: any;

//itemName: any;

  selectIcon(icon: string) {
    this.selectedIcon = icon;
  }

  createItemForm!: FormGroup;

  readonly dialog = inject(MatDialog);

  uploadedImage: SafeUrl | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }

  get categoryName() {
    return this.createItemForm.get('category_name')!;
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


    this.createItemForm = this.fb.group({
      itemName: ['', Validators.required],
      secondLanguageName: [''],
      description : [''],
      reference: ['', Validators.required],
      parentCategoryId : [''],
      schedule: this.fb.control<ScheduleEntry[]>(defaultSchedule),
      aggregator: [false],
      kiosk: [false],
      created_at: [new Date()],
      webShop: [false],
      counterTop: [false],
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

    dialogRef.afterClosed().subscribe((result: undefined) => {
      if (result !== undefined) {
        this.uploadedImage = result;
      }
    });

    dialogRef.componentInstance.imageRemoved.subscribe(() => {
      this.uploadedImage = null;
      this.cdr.detectChanges();
    });

  };
/*
  openAvailabilityDialog(): void {
    const dialogRef = this.dialog.open(MenuCategoryAvailabilityComponent, {
      width: '500px',
      height: '750px',
      maxWidth: '90vw',
      data: this.createItemForm.get('schedule')?.value || []
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createItemForm.get('schedule')?.setValue(result);
        this.scheduleSummary = this.generateScheduleSummary(result);
      }
    });
  }*/

  openAvailabilityDialog(): void {
    const dialogRef = this.dialog.open(MenuCategoryAvailabilityComponent, {
      width: '500px',
      height: '550px',
      data: {
        schedule: this.createItemForm.get('schedule')?.value || [],
        isAllDaysChecked: this.isAllDaysChecked(),
        isAllDayChecked: this.isAllDayChecked(),
        allDayStartTime: this.allDayStartTime(),
        allDayEndTime: this.allDayEndTime()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createItemForm.get('schedule')?.setValue(result.schedule);
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

}
