import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItemComponent } from "../menu-item/menu-item.component";

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  subItems? : MenuItem[];
}

@Component({
  selector: 'app-side-nav-content',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MenuItemComponent
],
  template: `

  <div class="dash-viewer-nav">
    <div class="dash-viewer-nav-content" [class.collapsed]="isCollapsed">
      <mat-nav-list>
        <a href="/dashboard">
        <img class="logo-container" src="4f.png" />
        </a>
        @for (item of menuItems(); track item.label) {
          <app-menu-item [item]="item" />
        }
      </mat-nav-list>
    </div>
  </div>
    
  `,
  styleUrl: '../main-layout/sidenav-style.scss'
})
export class SideNavContentComponent {
  
  isCollapsed = false;

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard'
    },
    {
      icon: 'shopping_cart',
      label: 'Transaction Orders',
      route: 'transaction-orders'
    },
    {
      icon: 'people',
      label: 'Customers',
      route: 'customers'
    },
    {
      icon: 'receipt_long',
      label: 'Reports',
      subItems : [
        {
          icon: '',
          label: 'Sales Reports',
          route: 'reports/sales'
        },
        {
          icon: '',
          label: 'Inventory Reports',
          route: 'inventory-reports'
        },
        {
          icon: '',
          label: 'Business Reports',
          route: 'business-reports'
        },
        {
          icon: '',
          label: 'Analysis Reports',
          route: 'analysis-reports'
        },
      ]
    },
    {
      icon: 'inventory_2',
      label: 'Inventory',
      subItems : [
        {
          icon: '',
          label: 'Inventory Items',
          route: 'items'
        },
        {
          icon: '',
          label: 'Consumption',
          route: 'reports'
        },
        {
          icon: '',
          label: 'Purchase Order',
          route: 'business-reports'
        },
        {
          icon: '',
          label: 'Receiving Product',
          route: 'analysis-reports'
        },
        {
          icon: '',
          label: 'Transfer Product',
          route: 'analysis-reports'
        },
        {
          icon: '',
          label: 'Transfer',
          route: 'analysis-reports'
        },
        {
          icon: '',
          label: 'Inventory Count',
          route: 'analysis-reports'
        },
        {
          icon: '',
          label: 'Manage',
          route: 'analysis-reports'
        },
        
      ]
    },
    {
      icon: 'menu_book',
      label: 'Product List',
      subItems: [
        {
          icon: '',
          label: 'Category',
          route: 'product-list/category'
        },

        {
          icon: '',
          label: 'Item',
          route: 'menu/item'
        },

        {
          icon: '',
          label: 'Modifier Group',
          route: 'menu/modifier-group'
        },
        {
          icon: '',
          label: 'Modifier Option',
          route: 'menu/modifier-option'
        }

      ]
    },
    
  ]);

}
