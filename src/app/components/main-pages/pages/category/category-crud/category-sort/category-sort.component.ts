import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MenuCategoriesService } from '../../../../../../service/api/menu-categories/menu-categories.service';
import { CategoryLevel0 } from '../../../../../../common/menu-categories';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../../../../service/notifications/notification.service';

@Component({
  selector: 'app-category-sort',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragHandle
  ],
  providers: [
    MenuCategoriesService,
    NotificationService
  ],
  templateUrl: './category-sort.component.html',
  styleUrl: './category-sort.component.scss'

})
export class CategorySortComponent implements OnInit {

  categoryToSort : CategoryLevel0[] = [];

  constructor(
    private categoryService: MenuCategoriesService,
    private notification : NotificationService
  ) { }

  ngOnInit(): void {
    this.getCategoriesToSortLevel0();
  }

  private getCategoriesToSortLevel0() {
    this.categoryService.getAllCategoryLevel0Sort().subscribe({
      next: (data: CategoryLevel0[]) => {
          this.categoryToSort = data;
      }, 
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching menu categories', error);
      }
    });
  }

  drop(event: CdkDragDrop<CategoryLevel0[]>) {
    
    moveItemInArray(this.categoryToSort, event.previousIndex, event.currentIndex);

     this.categoryToSort.forEach((cat, index) => cat.sortNumber = index + 1);

     this.categoryService.updateAllCategoryLevel0Sort(this.categoryToSort).subscribe({
      next: () => console.log(this.categoryToSort),
      error: (err) => console.error('Error updating sort order', err)
     })
  }

}
