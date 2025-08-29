import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TreeTableModule } from 'primeng/treetable';
import { MenuCategories } from '../../../../common/menu-categories';
import { TreeNode } from 'primeng/api';
import { MenuCategoriesService } from '../../../../service/api/menu-categories/menu-categories.service';
import { MatDialog } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';

export function convertCategoriesToTreeNodes(
  categories: MenuCategories[]
): TreeNode<MenuCategories>[] {
  return categories.map(category => ({
    key: category.categoryId?.toString(),
    label: category.categoryName,
    data: category,
    expanded: false,
    children: category.subCategories
      ? convertCategoriesToTreeNodes(category.subCategories)
      : []
  }));
}

interface Column {
  field: string;
  header: string;
  filter: boolean;
  styleClass: string;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatButtonToggleModule,
    TreeTableModule,
    ButtonModule,
    MatCheckboxModule,
    CheckboxModule,
    InputTextModule,
    MultiSelectModule

  ],
  providers: [
    MenuCategoriesService
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {

  categories: MenuCategories[] = [];
  treeNodes: TreeNode<MenuCategories>[] = [];
  selectedNodes!: TreeNode<MenuCategories>[];
  allChecked = false;
  someChecked = false;
  selectedSize = 'p-treetable-sm';
  cols!: Column[];
  selectedColumns!: Column[];
  selectedCount = signal(0);

  loading: boolean = true;

  ngOnInit(): void {
    this.getCategories();

    this.cols = [
      { field: 'categoryName', header: 'Name', filter: true, styleClass: 'col-name' },
      { field: 'image', header: 'Image', filter: false, styleClass: 'col-image' },
      { field: 'item', header: 'Item', filter: false, styleClass: 'col-item' },
      { field: 'webShop', header: 'Web Shop', filter: false, styleClass: 'col-toggle' },
      { field: 'aggregator', header: 'Aggregator', filter: false, styleClass: 'col-toggle' },
      { field: 'kiosk', header: 'Kiosk', filter: false, styleClass: 'col-toggle' },
      { field: 'counterTop', header: 'Counter Top', filter: false, styleClass: 'col-toggle-counter-top' },
      { field: 'createdAt', header: 'Created', filter: true, styleClass: 'col-created' },
      { field: 'isActive', header: 'Active', filter: false, styleClass: 'col-toggle-active' }
    ];

    this.selectedColumns = this.cols;
  }

  constructor(
    private menuCategoriesService: MenuCategoriesService,
    private dialog: MatDialog
  ) { }

  getCategories() {
    this.menuCategoriesService.getMenuCategories().subscribe({
      next: (data: MenuCategories[]) => {
        this.categories = [...data].sort((a, b) => (b.categoryId ?? 0) - (a.categoryId ?? 0)).map(cat => ({
          ...cat,
          createdAtFormatted: this.formatCreatedAt(cat.createdAt)
        }));
        this.treeNodes = convertCategoriesToTreeNodes(this.categories);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching menu categories', error);
      }
    });
  }

  toggleColumn(col: Column, checked: boolean) {
    if (checked) {
      this.selectedColumns = this.cols.filter(c =>
        this.selectedColumns.includes(c) || c === col
      );
    } else {
      this.selectedColumns = this.selectedColumns.filter(c => c !== col);
    }
  }
  getItemLabel(rowData: MenuCategories) {
    return rowData.item >= 0 ? `Items (${rowData.item})` : 'Items (0)';
  }

  toggleApplications() {
    if (!this.treeNodes) return;

    const shouldExpand = this.expandState !== 'expanded';

    this.treeNodes = this.treeNodes.map(node => ({
      ...node,
      expanded: shouldExpand,
      children: node.children ?? []
    }));
  }

  get expandState(): 'collapsed' | 'expanded' | 'mixed' {
    if (!this.treeNodes || this.treeNodes.length === 0) return 'collapsed';

    const allExpanded = this.treeNodes.every(parent => parent.expanded === true);
    const noneExpanded = this.treeNodes.every(parent => parent.expanded === false);

    if (allExpanded) return 'expanded';
    if (noneExpanded) return 'collapsed';
    return 'mixed';
  }

  toggleAll(checked: boolean) {
    this.allChecked = checked;
    this.selectedNodes = checked ? this.flattenTree(this.treeNodes) : [];
    this.someChecked = false;

     this.selectedCount.set(this.selectedNodes.length);
  }

  flattenTree(nodes: TreeNode<MenuCategories>[]): TreeNode<MenuCategories>[] {
    let result: TreeNode<MenuCategories>[] = [];
    for (let node of nodes) {
      result.push(node);
      if (node.children) {
        result = result.concat(this.flattenTree(node.children));
      }
    }
    return result;
  }

  onSelectionChange() {
    const flat = this.flattenTree(this.treeNodes);
    const selectedCount = this.selectedNodes?.length || 0;

    this.allChecked = selectedCount === flat.length;
    this.someChecked = selectedCount > 0 && !this.allChecked;

    this.selectedCount.set(selectedCount);
    console.log(this.selectedCount)
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

  onDeleteSelected(nodes: TreeNode<MenuCategories>[]) {
    if (!nodes || nodes.length === 0) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Confirmation',
        message: `Are you sure you want to delete ${nodes.length} selected row(s)?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Selected rows to delete:', nodes);
      }
    });
  }

}
