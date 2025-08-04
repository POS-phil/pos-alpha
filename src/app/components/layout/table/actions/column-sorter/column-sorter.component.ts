import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ColumnSorterService, ColumnInfo } from '../../../../../service/layout/column-sorter.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'va-mat-table-column-sorter, button[va-mat-table-column-sorter]',
  standalone: true,
  imports: [
    MatMenuModule,
    DragDropModule,
    CommonModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './column-sorter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [ColumnSorterService],
  styleUrl: './column-sorter.component.css'
})
export class ColumnSorterComponent implements OnInit, AfterViewInit {

  @Output() columnsChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Input() columns!: string[];
  @Input() columnNames!: string[];
  @Input() saveName?: string;

  columnInfo?: ColumnInfo[];

  constructor(private elementRef: ElementRef, private columnSorterService: ColumnSorterService) { }

  ngOnInit() {
    this.columnInfo = this.columns.map((currElement, index) => {
      return {
        id: currElement,
        name: this.columnNames[index],
        hidden: false,
      };
    });
    this.columnInfo = this.columnSorterService.loadSavedColumnInfo(this.columnInfo, this.saveName);
    this.emitColumns(false);
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.classList.add('va-mat-button-no-input');
  }

  columnMenuDropped(event: CdkDragDrop<any>): void {
    if (this.columnInfo) {
      moveItemInArray(this.columnInfo, event.item.data.columnIndex, event.currentIndex);
    }
    this.emitColumns(true);
  }

  toggleSelectedColumn(columnId: string) {
    const colFound = this.columnInfo?.find(col => col.id === columnId);
    if (colFound && colFound.name !== 'refference') {
      colFound.hidden = !colFound.hidden;
      this.emitColumns(true);
    }
    
  }

  private emitColumns(saveColumns: boolean) {
    window.requestAnimationFrame(() => {
      this.columnsChange.emit(this.columnInfo?.filter(colInfo => !colInfo.hidden).map(colInfo => colInfo.id) || []);
      if (saveColumns) {
        if (this.columnInfo) {
          this.columnSorterService.saveColumnInfo(this.columnInfo, this.saveName);
        }
      }
    });
  }

}
