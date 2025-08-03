import { Component, computed, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ScheduleEntry } from '../../../common/menu-categories';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogActions } from "@angular/material/dialog";
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

  readonly schedule = signal<ScheduleEntry>({
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
  });

  readonly partiallyAvailable = computed(() => {
    const schedule = this.schedule();
    if (!schedule.days) {
      return false;
    }
    return schedule.days.some(d => d.available) && !schedule.days.every(d => d.available);
  });

  update(available: boolean, index?: number) {
    this.schedule.update(schedule => {

      if (index == undefined) {
        schedule.available = available;
        schedule.days?.forEach(day => { day.available = available; });
      } else {
        schedule.days![index].available = available;
        schedule.available = schedule.days?.every(day => day.available) ?? true;
      }
      return { ...schedule }
    });
  }

  toggleAllDay(allDay: boolean, index?: number) {
    this.schedule.update(schedule => {
      if (index === undefined) {
        schedule.allDay = allDay;
      } else {
        schedule.days![index].allDay = allDay;
      }
      return { ...schedule };
    });
  }


}
