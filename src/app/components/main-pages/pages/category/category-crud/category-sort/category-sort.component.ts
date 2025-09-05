import { Component } from '@angular/core';
import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, CdkDragHandle} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-category-sort',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragHandle
  ],
  templateUrl: './category-sort.component.html',
  styleUrl: './category-sort.component.scss'
})
export class CategorySortComponent {

  items = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

}
