import { Component, computed, inject, inject as angularInject, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ScheduleEntry } from '../../../common/categories';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';


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

  private snackBar = inject(MatSnackBar);
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
  allDayStartTime = signal<string>(this.data?.allDayStartTime ?? '00:00');
  allDayEndTime = signal<string>(this.data?.allDayEndTime ?? '23:59');
  invalidDays = signal(new Set<number>());

  toggleAllDays(checked: boolean) {
    this.isAllDaysChecked.set(checked);
    this.isAllDayChecked.set(checked);

    // allDayStartTime: this.allDayStartTime(),
    // allDayEndTime: this.allDayEndTime()

    if (checked) {
      // When enabling "All Days", sync all days with master times
      const updatedSchedules = this.schedule().map(sched => ({
        ...sched,
        available: true,
        allDay: this.isAllDayChecked(),
        startTime: this.isAllDayChecked() ? '00:00' : this.allDayStartTime(),
        endTime: this.isAllDayChecked() ? '23:59' : this.allDayEndTime(),
        
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
    this.validateMasterTime();
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
    this.validateMasterTime();
  }

  hasInvalidMasterTime(): boolean {
    return !this.isTimeValid(this.allDayStartTime(), this.allDayEndTime());
  }

  validateMasterTime(): boolean {
    const start = this.allDayStartTime();
    const end = this.allDayEndTime();

    const isValid = this.isTimeValid(start, end);

    if (!isValid) {
      this.snackBar.open('Time range is invalid. End time must be later than start time.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'snackbar-error'
      });
    }

    return isValid;
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
      //reset time if allDay is checked
      if (index === dayIndex) {
        const updatedDay = {
          ...day,
          [field]: time,
          ...(day.allDay && {
            startTime: '00:00',
            endTime: '23:59'
          })
        };

        // Only validate if not allDay
        if (!updatedDay.allDay && !this.isTimeValid(updatedDay.startTime, updatedDay.endTime)) {
          const current = new Set(this.invalidDays());
          current.add(dayIndex);
          this.invalidDays.set(current);

          this.snackBar.open('Time range is invalid. End time must be later than start time.', 'Close', {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "top",
            panelClass: 'snackbar-error'
          });

        } else {
          const current = new Set(this.invalidDays());
          current.delete(dayIndex);
          this.invalidDays.set(current);
        }

        return updatedDay;
      }
      return day;
    });

    this.schedule.set(updatedSchedules);
  }

  isTimeValid(startTime: string | undefined, endTime: string | undefined): boolean {
    if (!startTime || !endTime) return true;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const start = startH * 60 + startM;
    const end = endH * 60 + endM;

    return end > start;
  }

  close(){
    this.dialogRef.close();
  }

  save() {
    const masterTimeIsValid = this.validateMasterTime();

    if (this.invalidDays().size > 0 || !masterTimeIsValid) {
      this.snackBar.open('Please fix invalid time entries before saving.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error']
      });
      return;
    }

    const sched = this.schedule();

    this.dialogRef.close({
      schedule: sched,
      allDayStartTime : this.allDayStartTime(),
      allDayEndTime: this.allDayEndTime(),
      isAllDaysChecked: this.isAllDaysChecked(),
      isAllDayChecked: this.isAllDayChecked()
    });
  }

}
