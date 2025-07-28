import { Component, inject, input, model } from '@angular/core';
import { DashboardService } from '../../service/dashboard/dashboard.service';
import { Widget } from '../../common/dashboard';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

interface Options {
  value : number;
  label : string;
}

@Component({
  selector: 'app-widgets-option',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './widgets-option.component.html',
  styleUrl: './widgets-option.component.css'
})
export class WidgetsOptionComponent {

  options : Options[] = [
    { value : 1, label: 'Basic Form'},
    { value : 2, label: 'Graph Form'},
  ];

  data = input.required<Widget>();
  showOptions = model<boolean>(false);
  store = inject(DashboardService);

  onOptionChange(value: number) {
    this.store.updateWidget(this.data().id, { options: value });

    const updateRowsAndColumnsOrderType = (id: number, value: number) => {
      const config = value === 1 
          ? { rows: 2, columns: 2 } 
          : { rows: 2, columns: 6 };
      this.store.updateWidget(id, config);
  };

    if(this.data().id === 9 || this.data().id === 10) {
      updateRowsAndColumnsOrderType(this.data().id, value);
    }

    this.showOptions.set(false)
  }

  onOpenedChange(opened: boolean) {
    // if (!opened) {
    //   this.showOptions.set(false);
    // }
  }
  
}
