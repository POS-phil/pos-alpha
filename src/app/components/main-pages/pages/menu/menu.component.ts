import { Component, inject, ViewChild } from '@angular/core';
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

export class MenuComponent {

  bulkColumns: string[] = ['bulk'];
  displayedColumns: string[] = ['check', 'category_name', 'image', 'reference', 'schedule', 'item', 'web_shop', 'aggregator', 'kiosk', 'last_order', 'created_at'];
  MENU_CATEGORIES_DATA = new MatTableDataSource<any>([]);
  //MENU_CATEGORIES_DATA!: MatTableDataSource<MenuCategories>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _liveAnnouncer = inject(LiveAnnouncer);

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
      : data.forEach(row => this.selection.select(row));
  }

}
