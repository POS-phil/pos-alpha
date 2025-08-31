import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TreeTableModule } from 'primeng/treetable';
import { MenuCategories, ToggleableFields } from '../../../../common/menu-categories';
import { TreeNode } from 'primeng/api';
import { MenuCategoriesService } from '../../../../service/api/menu-categories/menu-categories.service';
import { MatDialog } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { ToastModule } from 'primeng/toast';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { NotificationService } from '../../../../service/notifications/notification.service';

export function convertCategoriesToTreeNodes(
  categories: MenuCategories[]
): TreeNode<MenuCategories>[] {
  return categories.map(category => {
    
    const formattedCategory = {
      ...category,
      createdAtFormatted: category.createdAt ? new Date(category.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : ''
    };

    return {
      key: formattedCategory.categoryId?.toString(),
      label: formattedCategory.categoryName,
      data: formattedCategory,
      expanded: false,
      children: formattedCategory.subCategories
        ? convertCategoriesToTreeNodes(formattedCategory.subCategories)
        : []
    };
  });
}

function sortCategoriesAlphabetically(categories: MenuCategories[]): MenuCategories[] {
  return categories
    .map(cat => ({
      ...cat,
      subCategories: cat.subCategories
        ? sortCategoriesAlphabetically(cat.subCategories)
        : []
    }))
    .sort((a, b) => (a.categoryName ?? '').localeCompare(b.categoryName ?? ''));
}

function filterCategoriesByStatus(
  categories: MenuCategories[],
  status: 'all' | 'active' | 'inactive' | 'archive'
): MenuCategories[] {
  return categories
    .map(cat => {
      const filteredChildren = cat.subCategories
        ? filterCategoriesByStatus(cat.subCategories, status)
        : [];

      let includeCategory = false;
      switch (status) {
        case 'all':
          includeCategory = true;
          break;
        case 'active':
          includeCategory = cat.isActive === true;
          break;
        case 'inactive':
          includeCategory = cat.isActive === false;
          break;
        case 'archive':
          includeCategory = cat.isArchived === true;
          break;
      }

      if (includeCategory || filteredChildren.length > 0) {
        return { ...cat, subCategories: filteredChildren };
      } else {
        return null;
      }
    })
    .filter(Boolean) as MenuCategories[];
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
  changeDetection: ChangeDetectionStrategy.Default,
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
    MatSlideToggleModule,
    MatTabsModule,
    MatButtonToggleModule,
    TreeTableModule,
    ButtonModule,
    MatCheckboxModule,
    CheckboxModule,
    InputTextModule,
    MultiSelectModule,
    Breadcrumb

  ],
  providers: [
    MenuCategoriesService,
    NotificationService
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {

  constructor(
    private menuCategoriesService: MenuCategoriesService,
    private dialog: MatDialog,
    private notification : NotificationService,
    private router: Router,
  ) { }

  categories: MenuCategories[] = [];
  treeNodes: TreeNode<MenuCategories>[] = [];
  selectedNodes: TreeNode<MenuCategories>[] = [];
  allChecked = false;
  someChecked = false;
  selectedSize = 'p-treetable-sm';
  cols!: Column[];
  selectedColumns!: Column[];
  selectedCount = signal(0);
  statusFilter: 'all' | 'active' | 'inactive' | 'archive' = 'all';
  filteredCategories: MenuCategories[] = [];
  items: MenuItem[] | undefined;

  loading = signal(true);

  ngOnInit(): void {
    this.items = [ { label: 'Categories' }]
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

  getCategories() {
    this.menuCategoriesService.getMenuCategories().subscribe({
      next: (data: MenuCategories[]) => {
        
        this.categories = data;
        this.applyStatusFilter();
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error fetching menu categories', error);
        this.loading.set(false);
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

  applyStatusFilter() {
    this.filteredCategories = filterCategoriesByStatus(this.categories, this.statusFilter);
    this.treeNodes = convertCategoriesToTreeNodes(this.filteredCategories);
    this.onSelectionChange();
  }

  onStatusFilterChange(event: any) {
    //console.log('Filter changed:', event.value);
    this.statusFilter = event.value;
    this.applyStatusFilter();
  }

  getItemLabel(rowData: MenuCategories) {
    return rowData.item >= 0 ? `Items (${rowData.item})` : 'Items (0)';
  }

  toggleApplications() { if (!this.treeNodes) return; const shouldExpand = this.expandState !== 'expanded'; this.treeNodes = this.treeNodes.map(node => ({ ...node, expanded: shouldExpand, children: node.children ?? [] })); }

  get expandState(): 'collapsed' | 'expanded' | 'mixed' {
    if (!this.treeNodes || this.treeNodes.length === 0) return 'collapsed';

    const nodesWithChildren = this.treeNodes.filter(node => node.children && node.children.length > 0);

    if (nodesWithChildren.length === 0) return 'collapsed';

    const allExpanded = nodesWithChildren.every(node => !!node.expanded);
    const noneExpanded = nodesWithChildren.every(node => !node.expanded);

    if (allExpanded) return 'expanded';
    if (noneExpanded) return 'collapsed';

    return 'mixed';
  }

  toggleAll(checked: boolean) {
    const flat = this.flattenTree(this.treeNodes);
    this.selectedNodes = checked ? flat : [];
    this.allChecked = checked;
    this.someChecked = false;

    this.selectedCount.set(this.selectedNodes.length);
  }


  flattenTree(nodes: TreeNode<MenuCategories>[]): TreeNode<MenuCategories>[] {
    let result: TreeNode<MenuCategories>[] = [];
    for (const node of nodes) {
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

    this.allChecked = selectedCount === flat.length && flat.length > 0;
    this.someChecked = selectedCount > 0 && selectedCount < flat.length;

    this.selectedCount.set(selectedCount);
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
        //console.log('Selected rows to delete:', nodes);
        const categoryId = nodes.map(n => n.data?.categoryId).filter(categoryId => categoryId !== undefined) as number[];

        this.menuCategoriesService.deleteCategories(categoryId).subscribe({
          next: (response: string) => {
            this.notification.info(response);
            this.getCategories()
            this.selectedCount.set(0);
            this.selectedNodes = [];
          }, error: (err) => {
            console.error('Delete failed:', err);
            this.notification.info('error Delete failed' + err );
          }
        })
      }
    });
  }

  toggleSelection(node: TreeNode<MenuCategories>) {

    const idx = this.selectedNodes.findIndex(n => n.data?.categoryId === node.data?.categoryId);
    if (idx >= 0) {
      this.selectedNodes.splice(idx, 1);
    } else {
      this.selectedNodes.push(node);
    }

    this.selectedCount.set(this.selectedNodes.length);
    this.onSelectionChange();
  }

  isSelected(node: TreeNode<MenuCategories>) {
    return this.selectedNodes.some(n => n.data?.categoryId === node.data?.categoryId);
  }

  getToggleValue(rowData: MenuCategories, field: string): boolean {
    return rowData[field as ToggleableFields] ?? false;
  }

  onToggle(category: MenuCategories, field: string, newValue: boolean) {
    const key = field as ToggleableFields;


    const originalCategory = this.findCategoryById(this.categories, category.categoryId!);
    if (originalCategory) {
      originalCategory[key] = newValue;
    }

    this.menuCategoriesService.updateCategoryField(category.categoryId!, key, newValue)
      .subscribe({
        next: () => {
          //console.log(`Updated ${field} to ${newValue}`);

          const node = this.findTreeNodeByCategoryId(this.treeNodes, category.categoryId!);
          if (node && node.data) {
            (node.data as MenuCategories)[key] = newValue;
          }
        },
        error: (err) => {
          console.error('Failed to update', err);

          if (originalCategory) originalCategory[key] = !newValue;
          const node = this.findTreeNodeByCategoryId(this.treeNodes, category.categoryId!);
          if (node && node.data) {
            (node.data as MenuCategories)[key] = newValue;
          }
        }
      });
  }

  findCategoryById(categories: MenuCategories[], categoryId: number): MenuCategories | null {
    for (const cat of categories) {
      if (cat.categoryId === categoryId) return cat;
      if (cat.subCategories) {
        const found = this.findCategoryById(cat.subCategories, categoryId);
        if (found) return found;
      }
    }
    return null;
  }

  findTreeNodeByCategoryId(nodes: TreeNode<MenuCategories>[], categoryId: number): TreeNode<MenuCategories> | null {
    for (const node of nodes) {
      if (node.data?.categoryId === categoryId) return node;
      if (node.children) {
        const found = this.findTreeNodeByCategoryId(node.children, categoryId);
        if (found) return found;
      }
    }
    return null;
  }

  onEdit(category: MenuCategories, event: MouseEvent) {
    event.stopPropagation();
    const categoryId = category.categoryId
    this.router.navigate(['product-list/category/', categoryId, 'edit-category']);
  }

}
