import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MenuCategoriesService } from '../../../../../../service/api/menu-categories/menu-categories.service';
import { CategorySort } from '../../../../../../common/categories';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../../../../service/notifications/notification.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { MatIconModule } from '@angular/material/icon';
import { k } from "../../../../../../../../node_modules/@angular/material/module.d-m-qXd3m8";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-category-sort-level0',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    //CdkDragHandle,
    Breadcrumb,
    MatIconModule,
    MatTooltipModule
],
  providers: [
    MenuCategoriesService,
    NotificationService
  ],
  templateUrl: './category-sort-level0.component.html',
  styleUrl: './category-sort-level0.component.scss'

})
export class CategorySortLevel0Component implements OnInit {

  categoryToSort: CategorySort[] = [];
  items: MenuItem[] | undefined;

  constructor(
    private categoryService: MenuCategoriesService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.items = [{ label: 'Categories', routerLink: '/product-list/category' }, { label: 'Sort Categories'}]
    this.getCategoriesToSortLevel0();
  }

  private getCategoriesToSortLevel0() {
    this.categoryService.getAllCategoryLevel0Sort().subscribe({
      next: (data: CategorySort[]) => {
        this.categoryToSort = data;
        
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching menu categories', error);
      }
    });
  }

  drop(event: CdkDragDrop<CategorySort[]>) {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(this.categoryToSort, event.previousIndex, event.currentIndex);

    this.categoryToSort.forEach((cat, index) => cat.sortNumber = index + 1);

    this.categoryService.updateAllCategoryLevel0Sort(this.categoryToSort).subscribe({
      next: () => console.log(),
      error: (err) => console.error('Error updating sort order', err)
    })
  }

  openDialog() {
    console.log("yow")
  }

}
