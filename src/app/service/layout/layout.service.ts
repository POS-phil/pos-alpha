import { Injectable, Signal, signal } from '@angular/core';
import { MenuItemComponent } from '../../components/layout/menu-item/menu-item.component';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {

  private menuItemComponents: MenuItemComponent[] = [];

  // Register a new MenuItemComponent
  registerMenuItemComponent(menuItemComponent: MenuItemComponent): void {
    this.menuItemComponents.push(menuItemComponent);
  }

  // Trigger toggle on all MenuItemComponents (set nestedMenuOpen to false for all)
  triggerToggleNested(): void {
    this.menuItemComponents.forEach(menuItem => {
      menuItem.nestedMenuOpen.set(false); // Set the nestedMenuOpen to false for all
    });
  }
}
