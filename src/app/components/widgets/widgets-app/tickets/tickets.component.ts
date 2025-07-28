import { Component, inject, input, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Widget } from '../../../../common/dashboard';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChartData, ChartEvent, ChartOptions, ChartType, Colors } from 'chart.js';
import 'chartjs-plugin-annotation';
import { BaseChartDirective } from 'ng2-charts';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatListModule,
    MatGridListModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})
export class TicketsComponent {

  data = input.required<Widget>();

  public doughnutChartLabelsTicket: string[] = [
    'Open Tickets',
    'Closed Tickets',
  ];

  public doughnutChartLabelsValue: string[] = [
    'Value',
    'High Value',
  ];

  public doughnutChartTypeTicket: ChartType = 'doughnut';
  public doughnutChartTypeValue: ChartType = 'doughnut';

  public doughnutChartDataTicket: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabelsTicket,
    datasets: [
      {
        data: [5, 15],
        backgroundColor: ['#8dbae2', '#007FFF'],
        hoverOffset: 2,
      },
    ],
  };

  public doughnutChartDataValue: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabelsValue,
    datasets: [
      {
        data: [500, 5000],
        backgroundColor: ['#8dbae2', '#007FFF'],
        hoverOffset: 2,
      },
    ],
  };

  public doughnutChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    datasets:{
      doughnut: {
        
      }
    },
    plugins: {
      tooltip: {
        bodyAlign: 'center',
        displayColors: false,
        yAlign: 'top',
        titleFont: {
          size: 15,
        },
        bodyFont: {
          size: 15,
        }
      },
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          font: {
            size: 10
          },
          usePointStyle: true,
          generateLabels: function (chart: any) {
            const labels = chart.data.labels || [];
            const dataset = chart.data.datasets[0];
            return labels.map((label: string, i: number) => {
              return {
                text: `${label}: ${dataset.data[i]}`,
                fillStyle: dataset.backgroundColor[i],
                lineWidth: 0,
                fontColor: 'rgb(0, 10, 97)'
              }
            })
          }
        }
      }
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
