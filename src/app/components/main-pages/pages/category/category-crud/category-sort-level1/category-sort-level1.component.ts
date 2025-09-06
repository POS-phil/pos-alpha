import { Component, inject, OnInit, signal } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MenuCategoriesService } from '../../../../../../service/api/menu-categories/menu-categories.service';
import { CategorySort } from '../../../../../../common/categories';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../../../../service/notifications/notification.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SortingVerificationComponent } from '../category-dialogs/sorting-verification/sorting-verification.component';

@Component({
  selector: 'app-category-sort-level1',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    //CdkDragHandle,
    Breadcrumb,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    RouterModule
  ],
  providers: [
    MenuCategoriesService,
    NotificationService
  ],
  templateUrl: './category-sort-level1.component.html',
  styleUrl: './category-sort-level1.component.scss'
})
export class CategorySortLevel1Component implements OnInit {

  level0Id = signal<number>(0)
  level0Name = signal('')

  readonly dialog = inject(MatDialog);

  categoryToSort: CategorySort[] = [];
  items: MenuItem[] | undefined;

  constructor(
    private categoryService: MenuCategoriesService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const Level0categoryId = params.get('categoryId');
      const level0categoryName = params.get('categoryName');

      this.level0Id.set(parseInt(Level0categoryId ?? '0'));
      this.level0Name.set(level0categoryName ?? '');

      this.categoryService.getAllCategoryChildren(this.level0Id()).subscribe({
        next: (data: CategorySort[]) => {
          this.categoryToSort = data;

        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching menu categories', error);
        }
      })

    });
  }

  getCategoriesChild() {

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

  openDialogCheckIfHasChildOrItems(category: CategorySort) {
    const dialogRef = this.dialog.open(SortingVerificationComponent, {
      width: '400px',
      height: '300px',
      data: { categoryId: category.categoryId, categoryName: category.categoryName },
      panelClass: 'sort-checker-dialog'
    });

    dialogRef.afterClosed().subscribe(choice  => {
      if(choice === 'subcategories'){
        this.router.navigate(['product-list/category', category.categoryId ,'sort-category', category.categoryName]);
      } else {
        //this.router.navigate(['product-list/category/', category.categoryId ,'sort-category/']);
      }
    });
  }

}
