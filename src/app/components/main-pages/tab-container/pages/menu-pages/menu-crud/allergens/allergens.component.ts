import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatTabsModule } from '@angular/material/tabs';
import { CsMatTableComponent } from "../../../../../../layout/table/cs-mat-table/cs-mat-table.component";

@Component({
  selector: 'app-allergens',
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatButtonToggleModule,
    CsMatTableComponent,
    MatCheckbox
],
  templateUrl: './allergens.component.html',
  styleUrl: './allergens.component.css'
})
export class AllergensComponent implements OnInit {
expandCategory(_t75: any) {
throw new Error('Method not implemented.');
}
applyFilter($event: KeyboardEvent) {
throw new Error('Method not implemented.');
}
announceSortChange($event: Sort) {
throw new Error('Method not implemented.');
}
isSomeSelected(): unknown {
throw new Error('Method not implemented.');
}
isAllSelected(): unknown {
throw new Error('Method not implemented.');
}
toggleAllRows() {
throw new Error('Method not implemented.');
}
  bulkColumns: string[] = ['bulk'];
  sortableColumns: string[] = ['Image', 'Name', 'Sku', 'category', 'Item_Type', 'Price', 'Cost', 'Recipe', 'Created', 'Active'];
  displayedColumns: string[] = ['check','Image', 'Name', 'Sku', 'category', 'Item_Type', 'Price', 'Cost', 'Recipe', 'Created', 'Active'];
  //displayedColumnNames: string[] = ['check','Image', 'Name', 'Sku', 'category', 'Item_Type', 'Price', 'Cost', 'Recipe', 'Created', 'Active'];
  // Data source for the table
  itemList : AllergensComponent[] = [];
  
  selectedCount = signal(0);
  MENU_ALLERGENS_DATA : any;

  // Injecting LiveAnnouncer for accessibility announcements
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _liveAnnouncer = inject(LiveAnnouncer);
  dialog: any;
  selection: any;

  ngOnInit(): void {
    this.getCategories();
        this.selection.changed.subscribe(() => {
      this.selectedCount.set(this.selection.selected.length);
    });
  }

    getCategories() {
    this.MENU_ALLERGENS_DATA = new MatTableDataSource(this.itemList);
  }


}
