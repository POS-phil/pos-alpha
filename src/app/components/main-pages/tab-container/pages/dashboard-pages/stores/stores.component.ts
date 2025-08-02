import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatTableDataSource, MatTableModule,} from '@angular/material/table';
import { BranchStatistic } from '../../../../../../common/branch-statistic';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent implements AfterViewInit {
  
  BRANCH_STATISTICS_DATA : BranchStatistic[] = [
    {
      stores: 'store 1',
      active_orders: 5,
      active_orders_amount: 1000,
      occupied_tables: 3,
      number_of_cashiers: 2,
      online_cashiers: 1,
      open_tills: 4,
      last_sync: '2023-10-01 12:00:00',
      last_order: '2023-10-01 11:30:00'
    }
  ];

  displayedColumns: string[] = ['store', 'active_orders', 'active_orders_amount', 'occupied_tables', 'online_cashiers', 'open_tills', 'last_sync', 'last_order'];
  dataSource = new MatTableDataSource<BranchStatistic>(this.BRANCH_STATISTICS_DATA)

  private _liveAnnouncer = inject(LiveAnnouncer);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
