import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartEvent, ChartOptions, ChartType, Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Widget } from '../../../../common/dashboard';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
Chart.register(annotationPlugin);

@Component({
  selector: 'app-order-types',
  standalone: true,
  imports: [
    MatDividerModule,
    MatListModule,
    MatGridListModule,
    BaseChartDirective,
    MatIconModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [DecimalPipe],
  templateUrl: './order-types.component.html',
  styleUrl: './order-types.component.css'
})
export class OrderTypesComponent {

  constructor(private decimalPipe: DecimalPipe) {}

  data = input.required<Widget>();

  public lineChartOrderTypes: ChartType = 'line';

  labels2 = 
  [
    'Delivery Orders',
    'Dine In Orders',
    'Take Away Orders',
    'Drive Thru Orders',
  ]

  labels = Utils.times();

  public lineChartOrderTypesData: ChartData<'line'> = {
    labels: this.labels,
    datasets: [
      {
        label: 'Delivery Orders',
        data: [100, 200, 300, 400],
        backgroundColor: ['rgb(105, 34, 34)'],
        borderColor: ['rgb(105, 34, 34)'],
        borderWidth: 1,
      },
      {
        label: 'Dine In Orders',
        data: [200, 300, 400, 500],
        backgroundColor: ['rgb(162, 2, 255)'],
        borderColor: ['rgb(162, 2, 255)'],
        borderWidth: 1,
      },
      {
        label: 'Take Away Orders',
        data: [300, 400, 500, 600],
        backgroundColor: ['rgb(28, 102, 38)'],
        borderColor: ['rgb(28, 102, 38)'],
        borderWidth: 1,
      },
      {
        label: 'Drive Thru Orders',
        data: [400, 500, 600, 700],
        backgroundColor: ['rgb(19, 148, 148)'],
        borderColor: ['rgb(19, 148, 148)'],
        borderWidth: 1,
      }
    ]
  }

  public lineCharOderTypestOptions: ChartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        display: false,
        grid: {
          display: false
        }
      },
      x: {
        grid : {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        displayColors: false,
        yAlign: 'top',
        titleFont: {
          size: 15,
        },
        bodyFont: {
          size: 20,
        },
        // callbacks: {
        //   label: (tooltipItem) => {
        //     const dataset = tooltipItem.dataset.data as number[];
        //     const value = dataset[tooltipItem.dataIndex];
        //     const formattedValue = this.decimalPipe.transform(value * 2, '1.0-0');
        //     const customData = `AED ${formattedValue}`; // Example of custom data
        //     return `${customData}`;
        //   }
        // }
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
