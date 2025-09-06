import { Component, Inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuCategoriesService } from '../../../../../../../service/api/menu-categories/menu-categories.service';

@Component({
  selector: 'app-sorting-verification',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [
    MenuCategoriesService
  ],
  templateUrl: './sorting-verification.component.html',
  styleUrl: './sorting-verification.component.scss'
})
export class SortingVerificationComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<SortingVerificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categoryId: number, categoryName: string },
    private categoriesService : MenuCategoriesService
  ) {}



  subCategoriesDisable = signal(false);
  itemsDisable = signal(true);

  ngOnInit(): void {
    this.checkIfSubCategoriesAvailable(this.data.categoryId);
  }

  choose(option: 'subcategories' | 'items') {
    this.dialogRef.close(option);
  }

  checkIfSubCategoriesAvailable(categoryId : number) {
    this.categoriesService.hasChildren(categoryId).subscribe({
      next: (response : boolean) => {
        if(response){
          this.subCategoriesDisable.set(false);
        } else {
          this.subCategoriesDisable.set(true);
        }
      }
    })
  }

}
