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
import { MenuCategoriesService } from '../../../../service/api/menu-categories/menu-categories.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CsMatTableComponent } from "../../../layout/table/cs-mat-table/cs-mat-table.component";
import { ColumnSorterComponent } from '../../../layout/table/actions/column-sorter/column-sorter.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-menu',
  standalone: true,
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
    CsMatTableComponent,
    ColumnSorterComponent,
    MatTabsModule
  ],
  providers: [MenuCategoriesService],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})

export class MenuComponent implements OnInit {

  //displayedColumns: string[] = ['check', 'plus', 'reference', 'category_name', 'image', 'item', 'web_shop', 'aggregator', 'kiosk', 'counter_top', 'created_at', 'isActive'];
  sortableColumns: string[] = ['reference', 'category_name', 'image', 'item', 'web_shop', 'aggregator', 'kiosk', 'counter_top', 'created_at', 'isActive'];
  displayedColumnNames: string[] = ['Reference', 'Category Name', 'Image', 'Item', 'Web Shop', 'Aggregator', 'Kiosk', 'Counter Top', 'Created', 'Active']
  categoryList: MenuCategories[] = [];
  MENU_CATEGORIES_DATA: any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _liveAnnouncer = inject(LiveAnnouncer);

  ngOnInit(): void {
    this.getCategories();
  }

  constructor(
    private menuCategoriesService: MenuCategoriesService,
  ) { }

  getFinalDisplayedColumns(): string[] {
    return ['check','plus', ...this.sortableColumns];
  }

  getCategories() {

    this.menuCategoriesService.getMenuCategories().subscribe({
      next: (data: MenuCategories[]) => {
        this.categoryList = [...data].sort((a, b) => (b.categoryId ?? 0) - (a.categoryId ?? 0));

        this.MENU_CATEGORIES_DATA = new MatTableDataSource(this.categoryList);
        this.MENU_CATEGORIES_DATA.sort = this.sort;
        this.MENU_CATEGORIES_DATA.paginator = this.paginator;
        
      },
      error: (error) => {
        console.error('Error fetching menu categories', error);
      }
    });

    this.MENU_CATEGORIES_DATA = new MatTableDataSource(this.categoryList);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.MENU_CATEGORIES_DATA.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  formatCreatedAt(dateStr: string | Date): string {
    const date = new Date(dateStr);
    const now = new Date();

    const isSameYear = date.getFullYear() === now.getFullYear();

    const optionsSameYear: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    const optionsDifferentYear: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    return date.toLocaleString('en-US', isSameYear ? optionsSameYear : optionsDifferentYear);
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
