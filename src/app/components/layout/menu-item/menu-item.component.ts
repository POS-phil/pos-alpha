import { Component, Host, inject, input, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuItem, SideNavContentComponent } from '../side-nav-content/side-nav-content.component';
import { LayoutService } from '../../../service/layout/layout.service';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    MatListModule,
    RouterModule,
    MatIconModule
  ],
  template: `
    
    <a mat-list-item 
    [routerLink]="item().route" 
    routerLinkActive="item-selected"
    (click)="toggleNested()"
    >
      <mat-icon matListItemIcon> {{ item().icon }} </mat-icon>
      <span matListItemTitle> {{item().label}}</span>
      @if(item().subItems){
        <span matListItemMeta>
          @if(nestedMenuOpen()){
            <mat-icon>expand_less</mat-icon>
          } @else {
            <mat-icon>expand_more</mat-icon>
          }
          
        </span>
      }
    </a>

    @if(item().subItems && nestedMenuOpen()){
      <mat-nav-list>
        @for (subItem of item().subItems; track subItem.label) {
          <a mat-list-item 
          [routerLink]="subItem.route" 
          routerLinkActive="item-selected"
          >
            <mat-icon matListItemIcon> {{ subItem.icon }} </mat-icon>
            <span matListItemTitle> {{subItem.label}}</span>
          </a>
        }
      </mat-nav-list>
    }


  `,
  styleUrl: '../main-layout/sidenav-style.scss'
})
export class MenuItemComponent {

  item = input.required<MenuItem>();

  nestedMenuOpen = signal(false);

  constructor(
    @Host() private sideNavContentComponent: SideNavContentComponent,
    private layoutService : LayoutService,
  ) { 
    this.layoutService.registerMenuItemComponent(this);
  }

  toggleNested(): void {

    if (!this.item().subItems) {
      return;
    } else {

      if (this.sideNavContentComponent.isCollapsed) {
        this.sideNavContentComponent.isCollapsed = false;

        if (!this.item().subItems) {
          return;
        }

      }
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }

}
