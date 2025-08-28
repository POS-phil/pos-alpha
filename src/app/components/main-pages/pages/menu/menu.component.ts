import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { CdkTree, CdkTreeModule } from '@angular/cdk/tree';

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
    MatTabsModule,
    MatButtonToggleModule,
    CdkTreeModule
  ],
  providers: [MenuCategoriesService],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})

export class MenuComponent implements OnInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  sortableColumns: string[] = ['reference', 'image', 'item', 'web_shop', 'aggregator', 'kiosk', 'counter_top', 'created_at', 'isActive'];
  displayedColumnNames: string[] = ['Reference', 'Image', 'Item', 'Web Shop', 'Aggregator', 'Kiosk', 'Counter Top', 'Created', 'Active']
  categoryList: MenuCategories[] = [];
  @ViewChild(MatTable, { read: true }) table!: MatTable<any>;
  showSelectionHeader = false;
  selectedCount = signal(0);

  private _liveAnnouncer = inject(LiveAnnouncer);

  ngOnInit(): void {
    this.getCategories();
    this.selection.changed.subscribe(() => {
      this.selectedCount.set(this.selection.selected.length);
    });

  }

  constructor(
    private menuCategoriesService: MenuCategoriesService,
    private dialog: MatDialog
  ) { }

  getFinalDisplayedColumns(): string[] {
    return ['check', 'plus', 'category_name', ...this.sortableColumns];
  }

  MENU_CATEGORIES_DATA = new MatTableDataSource<MenuCategories>([]);

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

  selection = new SelectionModel<MenuCategories>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.MENU_CATEGORIES_DATA.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.MENU_CATEGORIES_DATA.data.forEach(row => this.selection.select(row));
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // perform delete logic
        console.log('Deleting rows', rows);
      }
    });
  }

}
