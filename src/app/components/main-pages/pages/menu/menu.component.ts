import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MenuCategories } from '../../../../common/menu-categories';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
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
    MatCheckbox
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})

export class MenuComponent implements OnInit {

  // Define the columns to be displayed in the table
  bulkColumns: string[] = ['bulk'];
  displayedColumns: string[] = ['check', 'reference', 'category_name', 'image', 'schedule', 'item', 'web_shop', 'aggregator', 'kiosk', 'counter_top' , 'last_order', 'created_at'];

  // Data source for the table
  categoryList : MenuCategories[] = [];
  MENU_CATEGORIES_DATA : any;

  // Injecting LiveAnnouncer for accessibility announcements
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _liveAnnouncer = inject(LiveAnnouncer);

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.MENU_CATEGORIES_DATA = new MatTableDataSource(this.categoryList);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  selection = new SelectionModel<any>(true, []);

  get selectedCount(): number {
    return this.selection.selected.length;
  }

  isAllSelected() {
    const data = this.MENU_CATEGORIES_DATA.data ?? [];
    return this.selection.selected.length > data.length;
  }

  isSomeSelected() {
    const data = this.MENU_CATEGORIES_DATA.data ?? [];
    const numSelected = this.selection.selected.length;
    return numSelected > 0 && numSelected < data.length;
  }

  toggleAllRows() {
    const data = this.MENU_CATEGORIES_DATA.data ?? [];
    this.isAllSelected()
      ? this.selection.clear()
      : data.forEach((row: any) => this.selection.select(row));
  }

}
