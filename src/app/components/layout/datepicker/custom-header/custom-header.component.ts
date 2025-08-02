import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './custom-header.component.html',
  styleUrl: './custom-header.component.css'
})
export class CustomHeaderComponent<D> {

  constructor(
    private calendar: MatCalendar<D>, 
    private dateAdapter: DateAdapter<D>, 
    @Inject(MAT_DATE_FORMATS)
    private dateFormats: MatDateFormats 
  ) { }

  get periodLabel(): string {
    return this.dateAdapter
      .format(this.calendar.activeDate, this.dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  previousClicked(mode: 'month' | 'year'): void {
    this.changeDate(mode, -1);
  }

  nextClicked(mode: 'month' | 'year'): void {
    this.changeDate(mode, 1);
  }

  private changeDate(mode: 'month' | 'year', amount: -1 | 1): void {

    this.calendar.activeDate =
      mode === 'month'
        ? this.dateAdapter.addCalendarMonths(this.calendar.activeDate, amount)
        : this.dateAdapter.addCalendarYears(this.calendar.activeDate, amount);
  }

  openMonthPicker() {
    this.calendar.currentView = 'year';
  }

}
