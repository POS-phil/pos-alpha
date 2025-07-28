import { Component, input } from '@angular/core';
import { Widget } from '../../../../common/dashboard';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChartData, ChartEvent, ChartOptions, ChartType, Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { BaseChartDirective } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DecimalPipe } from '@angular/common';
Chart.register(annotationPlugin);

@Component({
  selector: 'app-return-amount',
  standalone: true,
  imports: [
    DecimalPipe,
    MatGridListModule,
    BaseChartDirective,
    MatIconModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [DecimalPipe],
  templateUrl: './return-amount.component.html',
  styleUrl: './return-amount.component.css'
})
export class ReturnAmountComponent {

  constructor(private decimalPipe: DecimalPipe) {}

  dataset : number[] = [100, 200, 300, 400, 500, 600, 700, 800, 900, 800, 700, 750, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];

  sumDataset = this.dataset.reduce((acc, val) => acc + val, 0);

  data = input.required<Widget>();

  labels = Utils.times();

  public barChartReturnAmount: ChartType = 'bar';

  public barChartReturnAmountData: ChartData<'bar'> = {
    labels: this.labels,
    datasets: [{
      label: 'Sales',
      data: this.dataset,
      backgroundColor: ['#74BBFB'],
      borderColor: ['rgb(75, 192, 192)'],
      borderWidth: 1,
    }]
  }

  public barChartReturnAmountOptions: ChartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        offset: true,
        ticks: {
          color: 'black',
          callback: function (this: any, value: number | string, index: number, ticks: any[]) {
            const lastIndex = ticks.length - 1;
            if (index % 3 === 0 || index === lastIndex) {
              return this.getLabelForValue(value); // This returns a string label
            }
            return undefined; // Explicitly return undefined to skip the label
          },
          autoSkip: false,
          maxRotation: 85,
          minRotation: 85,
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        display: false,
        grid: {
          display: false
        }
      }
    },
    layout: {
      padding: {

      }
    },
    plugins: {
      tooltip: {
        displayColors: false,
        yAlign: 'top',
        titleFont: {
          size: 15,
        },
        bodyFont: {
          size: 20,
        },
        callbacks: {
          label: (tooltipItem) => {
            const dataset = tooltipItem.dataset.data as number[];
            const value = dataset[tooltipItem.dataIndex];
            const formattedValue = this.decimalPipe.transform(value * 2, '1.0-0');
            const customData = `AED ${formattedValue}`; // Example of custom data
            return `${customData}`;
          }
        }
      },
      legend: {
        display: false,
      },
    }
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    if (active && active.length > 0) {
      // const chartElement: any = active[0];
      // const datasetIndex = chartElement.datasetIndex;
      // const index = chartElement.index;
      // const value = this.doughnutChartDataTicket.datasets[datasetIndex].data[index];
      // const label = this.doughnutChartDataTicket.labels?.[index];
      // console.log(`Clicked on ${label}: ${value}`);
    }
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    const target = (event.native as MouseEvent)?.target as HTMLElement;

    if (target) {
      target.style.cursor = active?.length ? 'pointer' : 'default';
    }
  }

}

class Utils {
  static months(options: { count: number }): string[] {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames.slice(0, options.count);
  }

  static times(): string[] {
    const times = [];
    for (let hour = 0; hour <= 23; hour++) {
      const period = hour < 12 ? "AM" : "PM";
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      const minute = "00";
      times.push(`${hour12}:${minute} ${period}`);
    }
    return times;
  }
}
