import { Component, inject, Injector, input, signal } from '@angular/core';
import { Widget } from '../../common/dashboard';
import { DashboardService } from '../../service/dashboard/dashboard.service';
import { WidgetsOptionComponent } from "../widgets-option/widgets-option.component";
import { CommonModule, NgComponentOutlet, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag, CdkDragPlaceholder, CdkDragPreview } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-widgets-component',
  standalone: true,
  imports: [
    WidgetsOptionComponent,
    NgComponentOutlet,
    MatButtonModule,
    MatIconModule,
    CdkDrag,
    CdkDragPlaceholder,
  ],
  templateUrl: './widgets-component.component.html',
  styleUrl: './widgets-component.component.css',
  host: {
    '[style.grid-area]' : '"span " + (data().rows ?? 1) + "/ span " + (data().columns ?? 1)'
  },
})
export class WidgetsComponentComponent {

  data = input.required<Widget>();
  store = inject(DashboardService);
  showOptions = signal(false);

}
