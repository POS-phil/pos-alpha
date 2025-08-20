import { Component, Host, inject, input, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuItem, SideNavContentComponent } from '../side-nav-content/side-nav-content.component';
import { LayoutService } from '../../../service/layout/layout.service';
import { MatMenuModule } from '@angular/material/menu';
import { map, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';

const EXTRA_SMALL_WIDTH_BREAKPOINT = 720;
const SMALL_WIDTH_BREAKPOINT = 959;

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    RouterModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    @if((isExtraScreenSmall | async) === true){

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

    } @else {

      @if(!item().subItems) {
      <a mat-list-item class="item-nav"
         [routerLink]="item().route"
         routerLinkActive="item-selected">
        <mat-icon matListItemIcon class="icon-nav">{{ item().icon }}</mat-icon>
        <span matListItemTitle class="font-nav">{{ item().label }}</span>
      </a>
    }

    @if(item().subItems) {
      <a mat-list-item class="item-nav"
         [matMenuTriggerFor]="menu">
          <mat-icon matListItemIcon class="icon-nav">{{ item().icon }}</mat-icon>
          <span matListItemTitle class="font-nav">{{ item().label }}</span>
        <!-- <span matListItemMeta class="arrow-right-grid">
          <mat-icon>arrow_right</mat-icon>
        </span> -->
      </a>

      <mat-menu #menu="matMenu" class="custom-side-menu">
        <div class="menu-title"><mat-icon class="icon2">{{ item().icon }}</mat-icon> <h2> {{ item().label }}</h2></div>
        @for (subItem of item().subItems; track subItem.label) {
          <button mat-menu-item
                  [routerLink]="subItem.route"
                  routerLinkActive="item-selected">
            <mat-icon>{{ subItem.icon }}</mat-icon>
            {{ subItem.label }}
          </button>
        }
      </mat-menu>
    }


    }
    

  `,
  styleUrl: '../main-layout/sidenav-style.scss'
})
export class MenuItemComponent {

  item = input.required<MenuItem>();

  nestedMenuOpen = signal(false);

  isExtraScreenSmall: Observable<boolean>;
  isScreenSmall: Observable<boolean>;

  constructor(
    @Host() private sideNavContentComponent: SideNavContentComponent,
    private layoutService: LayoutService,
    breakpoints: BreakpointObserver,
  ) {
    this.layoutService.registerMenuItemComponent(this);
    this.isExtraScreenSmall = breakpoints
      .observe(`(max-width: ${EXTRA_SMALL_WIDTH_BREAKPOINT}px)`)
      .pipe(map(breakpoint => breakpoint.matches))

    this.isScreenSmall = breakpoints
      .observe(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`)
      .pipe(map(breakpoint => breakpoint.matches));
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
