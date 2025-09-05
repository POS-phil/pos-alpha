import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { UploadImageComponent } from '../../../../../../dialogs/upload-image/upload-image.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SafeUrl } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuCategoryAvailabilityComponent } from '../../../../../../dialogs/menu-category-availability/menu-category-availability.component';
import { MatChipsModule } from '@angular/material/chips';
import { MenuCategories, ScheduleEntry } from '../../../../../../../common/menu-categories';
import { SubModifierOptions } from '../../../../../../../common/addons-builders';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatSort, MatSortModule,Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-create-modifier-option',
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
    // MatCheckbox,
    MatTableModule,
    MatSortModule,
  ],
  templateUrl: './create-modifier-option.component.html',
  styleUrls: ['./create-modifier-option.component.scss']
})
export class CreateModifierOptionComponent {

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

  createCategoryForm!: FormGroup;

  readonly dialog = inject(MatDialog);

  uploadedImage: SafeUrl | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }

  get modifier_name() {
    return this.createCategoryForm.get('modifier_name')!;
  }
  // Define the columns to be displayed in the table
  bulkColumns: string[] = ['bulk'];
  displayedColumns: string[] = ['name', 'net_qty', 'yield', 'waste_qty', 'prep_wastage', 'gross_qty', 'modifier', 'incl_in_cost', 'cost_per_unit'];
  // Data source for the table
  categoryList: MenuCategories[] = [];
  MENU_CATEGORIES_DATA: any;

  SubModifierColumns: string[] = ['bulk'];
  SubModifierdisplayedColumns: string[] = ['name', 'net_qty'];
  // Data source for the table
  SubModifierList: SubModifierOptions[] = [];
  Sub_Modifier_DATA: any;

  // Injecting LiveAnnouncer for accessibility announcements
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _liveAnnouncer = inject(LiveAnnouncer);
  ngOnInit(): void {

    this.createCategoryForm = this.fb.group({
      modifier_name: ['', Validators.required],
      reference: ['', Validators.required],
      // schedule: this.fb.control<ScheduleEntry>(defaultSchedule),
      web_shop: [false],
      aggregator: [false],
      kiosk: [false],
      created_at: [new Date()],
    });

    // this.scheduleSummary = this.generateScheduleSummary(defaultSchedule);
  }
  getCategories() {
    this.MENU_CATEGORIES_DATA = new MatTableDataSource(this.categoryList);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  selection = new SelectionModel<any>(true, []);

  get selectedCount(): number {
    return this.selection.selected.length;
  }

  isAllSelected() {
    const data = this.MENU_CATEGORIES_DATA.data ?? [];
    return this.selection.selected.length > data.length;
  }
  isSomeSelected() {
    const data = this.MENU_CATEGORIES_DATA.data ?? [];
    const numSelected = this.selection.selected.length;
    return numSelected > 0 && numSelected < data.length;
  }

  toggleAllRows() {
    const data = this.MENU_CATEGORIES_DATA.data ?? [];
    this.isAllSelected()
      ? this.selection.clear()
      : data.forEach((row: any) => this.selection.select(row));
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
      data: this.createCategoryForm.get('schedule')?.value || []
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createCategoryForm.get('schedule')?.setValue(result);
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
