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

  readonly schedule = signal<ScheduleEntry>(
  inject(MAT_DIALOG_DATA) ?? {
    // fallback default (in case it's undefined)
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
  }
);

  readonly partiallyAvailable = computed(() => {
    const schedule = this.schedule();
    if (!schedule.days) {
      return false;
    }
    return schedule.days.some(d => d.available) && !schedule.days.every(d => d.available);
  });

  update(available: boolean, index?: number) {
    this.schedule.update(schedule => {
      if (index === undefined) {
        // Master toggle (All Days checkbox)
        schedule.available = available;

        const defaultDayTemplate = (): ScheduleEntry => ({
          available: true,
          allDay: true,
          startTime: '00:00',
          endTime: '23:59',
          day: '',
        });

        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        // Regenerate full week if not present or empty
        if (!schedule.days || schedule.days.length !== 7) {
          schedule.days = dayNames.map(day => ({
            ...defaultDayTemplate(),
            day,
          }));
        } else {
          // Apply toggle to each day
          schedule.days.forEach(day => {
            day.available = available;
            day.allDay = available;
            if (available) {
              day.startTime = '00:00';
              day.endTime = '23:59';
            }
          });
        }

        // Sync master allDay
        schedule.allDay = available;

      } else {
        // Individual toggle
        schedule.days![index].available = available;

        // Recalculate master toggle
        schedule.available = schedule.days?.every(day => day.available) ?? true;

        if (!schedule.available) {
          schedule.allDay = false;
        } else {
          // If all days are now available, reset all their allDay flags to false
          schedule.days?.forEach(day => {
            day.allDay = false;
          });
          schedule.allDay = false;
        }
      }

      return { ...schedule };
    });
  }

  isTimeValid(startTime: string | undefined, endTime: string | undefined): boolean {
    if (!startTime || !endTime) return true;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const start = startH * 60 + startM;
    const end = endH * 60 + endM;

    return end > start;
  }

  updateTime(index: number | undefined, field: 'startTime' | 'endTime', value: string) {
    this.schedule.update(schedule => {
      if (index === undefined) {
        schedule[field] = value;
        // Sync to all days if available and not allDay
        if (schedule.available && !schedule.allDay) {
          schedule.days?.forEach(day => {
            if (day.available && !day.allDay) {
              day[field] = value;
            }
          });
        }
      } else {
        const day = schedule.days![index];
        if (!day.allDay && day.available) {
          day[field] = value;
        }
      }
      return { ...schedule };
    });
  }

  toggleAllDay(allDay: boolean, index?: number) {
  this.schedule.update(schedule => {
    if (index === undefined) {
      // Master allDay toggle
      schedule.allDay = allDay;

      if (schedule.available) {
        schedule.days?.forEach(day => {
          day.allDay = allDay;

          if (allDay) {
            day.startTime = '00:00';
            day.endTime = '23:59';
          }
        });
      }

      // Set times if switching ON
      if (allDay) {
        schedule.startTime = '00:00';
        schedule.endTime = '23:59';
      }

    } else {
      // Per-day toggle
      const day = schedule.days![index];
      day.allDay = allDay;

      if (allDay) {
        day.startTime = '00:00';
        day.endTime = '23:59';
      }
    }

    // 👇 Fix: do not auto-reset master.allDay just because all days are checked
    const allChecked = schedule.days?.every(day => day.available);
    if (allChecked) {
      schedule.available = true;
    }

    return { ...schedule }; // 👈 force reactivity
  });
}

  save() {
    const sched = this.schedule();

    // If master is on and not allDay, validate its time
    if (sched.available && !sched.allDay && !this.isTimeValid(sched.startTime, sched.endTime)) {
      alert('Main schedule time is invalid. "Time To" must be greater than "Time From".');
      return;
    }

    // Check each day’s time validity
    for (const day of sched.days!) {
      if (day.available && !day.allDay && !this.isTimeValid(day.startTime, day.endTime)) {
        alert(`Invalid time for ${day.day}. "Time To" must be greater than "Time From".`);
        return;
      }
    }

    // If all time validations pass
    this.dialogRef.close(sched);
  }

}
