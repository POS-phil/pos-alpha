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
import { MenuCategories } from '../../../../common/menu-categories';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CsMatTableComponent } from '../../../layout/table/cs-mat-table/cs-mat-table.component';
import { ColumnSorterComponent } from '../../../layout/table/actions/column-sorter/column-sorter.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-item',
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
    MatCheckbox,
    MatSlideToggleModule,
    MatTabsModule,
    MatButtonToggleModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent  implements OnInit {

// Define the columns to be displayed in the table
  bulkColumns: string[] = ['bulk'];
  sortableColumns: string[] = ['Image', 'Name', 'Sku', 'category', 'Item_Type', 'Price', 'Cost', 'Recipe', 'Created', 'Active'];
  displayedColumns: string[] = ['check','Image', 'Name', 'Sku', 'category', 'Item_Type', 'Price', 'Cost', 'Recipe', 'Created', 'Active'];
  //displayedColumnNames: string[] = ['check','Image', 'Name', 'Sku', 'category', 'Item_Type', 'Price', 'Cost', 'Recipe', 'Created', 'Active'];
  // Data source for the table
  itemList : ItemComponent[] = [];
  
  selectedCount = signal(0);
  MENU_ITEMS_DATA : any;

  // Injecting LiveAnnouncer for accessibility announcements
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _liveAnnouncer = inject(LiveAnnouncer);
  dialog: any;

  ngOnInit(): void {
    this.getCategories();
        this.selection.changed.subscribe(() => {
      this.selectedCount.set(this.selection.selected.length);
    });
  }

  getCategories() {
    this.MENU_ITEMS_DATA = new MatTableDataSource(this.itemList);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  selection = new SelectionModel<any>(true, []);
/*
  get selectedCount(): number {
    return this.selection.selected.length;
  }*/

  isAllSelected() {
    const data = this.MENU_ITEMS_DATA.data ?? [];
    return this.selection.selected.length > data.length;
  }

  isSomeSelected() {
    const data = this.MENU_ITEMS_DATA.data ?? [];
    const numSelected = this.selection.selected.length;
    return numSelected > 0 && numSelected < data.length;
  }

  toggleAllRows() {
    const data = this.MENU_ITEMS_DATA.data ?? [];
    this.isAllSelected()
      ? this.selection.clear()
      : data.forEach((row: any) => this.selection.select(row));
  }


    onDeleteSelected(rows: any[]) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Confirmation',
        message: `Are you sure you want to delete ${rows.length} selected row(s)?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });
    }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.MENU_ITEMS_DATA.filter = filterValue.trim().toLowerCase();
  }


    expandCategory(parent: MenuCategories) {
    const parentIndex = this.MENU_ITEMS_DATA.data.findIndex(
      (c: MenuCategories) => c.categoryId === parent.categoryId
    );
  }

  
}
