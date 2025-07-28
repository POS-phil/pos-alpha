import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TransactionOrders } from '../../../../common/transaction-orders';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { CsMatTableComponent } from "../../../layout/table/cs-mat-table/cs-mat-table.component";
import { ColumnSorterComponent } from '../../../layout/table/actions/column-sorter/column-sorter.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-transaction-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    DragDropModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    CsMatTableComponent,
    ColumnSorterComponent
],
  templateUrl: './transaction-orders.component.html',
  styleUrl: './transaction-orders.component.css',
  
})
export class TransactionOrdersComponent implements AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  TRANSACTION_ORDERS_DATA : TransactionOrders[] = [
    {
      refference: 1,
      number: 1001,
      check_number: 102,
      store: 'Store 1',
      customer: 'Customer 1',
      status: 'Completed',
      source: 'Cashier',
      app_name: '-',
      total: 100.00,
      order_type: 'Dine In',
      delivery_status: '-',
      bussiness_date: new Date('2023-10-01'),
      opened_at: new Date('2023-10-01T10:00:00')
    }
  ];

  displayedColumns: string[] = ['refference', 'number', 'check_number', 'store', 'customer', 'status', 'source', 'app_name', 'total', 'order_type', 'delivery_status', 'bussiness_date', 'opened_at'];
  displayedColumnNames: string[] = ['Refference', 'Number', 'Check Number', 'Store', 'Customer', 'Status', 'Source', 'App Name', 'Total', 'Order Type', 'Delivery Status', 'Business Date', 'Opened At'];
  dataSource = new MatTableDataSource<TransactionOrders>(this.TRANSACTION_ORDERS_DATA);

  private _liveAnnouncer = inject(LiveAnnouncer);

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
