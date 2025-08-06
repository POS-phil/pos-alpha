import { Component, computed, inject, inject as angularInject, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ScheduleEntry } from '../../../common/menu-categories';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-menu-category-availability',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDialogActions,
    MatDialogActions,
    MatButtonModule,
  ],
  templateUrl: './menu-category-availability.component.html',
  styleUrl: './menu-category-availability.component.scss'
})
export class MenuCategoryAvailabilityComponent {

  readonly dialogRef = inject(MatDialogRef<MenuCategoryAvailabilityComponent>);

  data = inject(MAT_DIALOG_DATA);

  readonly schedule = signal<ScheduleEntry[]>(
    this.data?.schedule?.length > 0
      ? this.data.schedule
      : [
        { day: 'sunday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
        { day: 'monday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
        { day: 'tuesday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
        { day: 'wednesday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
        { day: 'thursday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
        { day: 'friday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
        { day: 'saturday', available: true, allDay: true, startTime: '00:00', endTime: '23:59' },
      ]
  );

  isAllDaysChecked = signal(this.data?.isAllDaysChecked ?? true);
  isAllDayChecked = signal(this.data?.isAllDayChecked ?? true);
  allDayStartTime = signal('00:00');
  allDayEndTime = signal('23:59');

  toggleAllDays(checked: boolean) {
    this.isAllDaysChecked.set(checked);
    this.isAllDayChecked.set(checked);

    if (checked) {
      // When enabling "All Days", sync all days with master times
      const updatedSchedules = this.schedule().map(sched => ({
        ...sched,
        available: true,
        allDay: this.isAllDayChecked(),
        startTime: this.isAllDayChecked() ? '00:00' : this.allDayStartTime(),
        endTime: this.isAllDayChecked() ? '23:59' : this.allDayEndTime()
      }));

      this.schedule.set(updatedSchedules);
    }
  }

  isMasterAllDayChecked(value: boolean) {
    this.isAllDayChecked.set(value);
    if (value) {
      const updatedSchedules = this.schedule().map(sched => {
        return {
          ...sched,
          allDay: value,
          startTime: value ? '00:00' : sched.startTime,
          endTime: value ? '23:59' : sched.endTime
        };
      });

      this.schedule.set(updatedSchedules);
    } else; {
      this.allDayStartTime.set('00:00');
      this.allDayEndTime.set('23:59');
    }
  }

  updateMasterStartTime(time: string) {
    this.allDayStartTime.set(time);
    if (this.isAllDaysChecked()) {
      const updatedSchedules = this.schedule().map(sched => ({
        ...sched,
        startTime: time
      }));
      this.schedule.set(updatedSchedules);
    } else {
      this.allDayStartTime.set("00:00");
    }
  }

  updateMasterEndTime(time: string) {
    this.allDayEndTime.set(time);
    if (this.isAllDaysChecked()) {
      const updatedSchedules = this.schedule().map(sched => ({
        ...sched,
        endTime: time
      }));
      this.schedule.set(updatedSchedules);
    } else {
      this.allDayEndTime.set("23:59");
    }
  }

  toggleAllDay(dayIndex: number, checked: boolean) {
    const updatedSchedules = [...this.schedule()];
    const day = updatedSchedules[dayIndex];

    day.allDay = checked;

    if (checked) {
      day.startTime = "00:00";
      day.endTime = "23:59";
    }

  }

  updateDayTime(dayIndex: number, field: 'startTime' | 'endTime', time: string) {
    const updatedSchedules = this.schedule().map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          [field]: time,
          // Reset to "All Day" times if needed
          ...(day.allDay && {
            startTime: '00:00',
            endTime: '23:59'
          })
        };
      }
      return day;
    });

    this.schedule.set(updatedSchedules); // Force change detection
  }

  isTimeValid(startTime: string | undefined, endTime: string | undefined): boolean {
    if (!startTime || !endTime) return true;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const start = startH * 60 + startM;
    const end = endH * 60 + endM;

    return end > start;
  }

  save() {
    const sched = this.schedule();

    this.dialogRef.close({
      schedule: sched,
      isAllDaysChecked: this.isAllDaysChecked(),
      isAllDayChecked: this.isAllDayChecked()
    });
  }

}
