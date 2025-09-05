import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { wrapGrid } from 'animate-css-grid'
import { CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DATE_RANGE_SELECTION_STRATEGY, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MAT_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { WidgetsComponentComponent } from '../../../widgets-component/widgets-component.component';
import { DashboardService } from '../../../../service/dashboard/dashboard.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { CustomHeaderComponent } from '../../../layout/datepicker/custom-header/custom-header.component';
import { MatSelectModule } from '@angular/material/select';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    WidgetsComponentComponent,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CdkDropList,
    CdkDropListGroup,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule
  ],
  providers: [
    DashboardService,
    provideNativeDateAdapter(),

  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {

  customHeader = CustomHeaderComponent;
  isCompare = false

  readonly date = new FormControl(new Date());

  stores = new FormControl;
  storesList = ['store 1', 'store 2', 'store 3', 'store 4', 'store 5'];
  previousSelection: string[] = [];

  store = inject(DashboardService);

  dasboard = viewChild.required<ElementRef>('dashboard');

  isWeekMode = false;
  cdr: any;


  toggleWeekMode(): void {
    this.isWeekMode = !this.isWeekMode;
  }
  
  ngOnInit(): void {
    this.stores.setValue(['All', ...this.storesList]);
    this.previousSelection = this.stores.value;

    wrapGrid(this.dasboard().nativeElement, { duration: 300 })
  }

  onStoreSelectionChange(event: any) {
    const selectedValues: string[] = event.value || [];
    const allOption = 'All';
    const storeList = this.storesList;

    const hasAll = selectedValues.includes(allOption);
    const allStoresSelected = storeList.every(store => selectedValues.includes(store));
    const hadAll = this.previousSelection.includes(allOption);

    // Case 1: User selected "All" -> select all
    if (hasAll && !hadAll) {
      this.stores.setValue([allOption, ...storeList]);
      this.previousSelection = this.stores.value;
      return;
    }

    // Case 2: User unselected "All" -> clear all
    if (!hasAll && hadAll) {
      this.stores.setValue([]);
      this.previousSelection = this.stores.value;
      return;
    }

    // Case 3: All individual stores selected manually -> add "All"
    if (!hasAll && allStoresSelected) {
      this.stores.setValue([allOption, ...storeList]);
      this.previousSelection = this.stores.value;
      return;
    }

    // Case 4: A store was unselected while "All" is still selected -> remove "All"
    if (hasAll && !allStoresSelected) {
      const filtered = selectedValues.filter(val => val !== allOption);
      this.stores.setValue(filtered);
      this.previousSelection = this.stores.value;
      return;
    }

    // Default: regular selection
    this.stores.setValue(selectedValues);
    this.previousSelection = this.stores.value;
  }

  drop(event: CdkDragDrop<number, any>) {
    const { previousContainer, container } = event;
    this.store.updateWidgetPosition(previousContainer.data, container.data)
  }

  toggleCompare(event: any): void {
    this.isCompare = event.checked; 
  }


}
