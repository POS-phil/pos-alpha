import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTabNav } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-tab',
  imports: [
    MatTabsModule,
    RouterModule,
    CommonModule
  ],
  template: `
    <div class="tab-viewer-container"> 
      <div class="tab-viewer">
        <nav mat-tab-nav-bar [tabPanel]="tabPanel" class="docs-component-viewer-tabbed-content" style="outline: none;" mat-stretch-tabs="false">
            <a routerLink="general"
              routerLinkActive="active"
              mat-tab-link>
                GENERAL
            </a>
            <a routerLink="stores" 
              routerLinkActive="active" 
              mat-tab-link>
                STORES
            </a>
            <a routerLink="inventory" 
              routerLinkActive="active" 
              mat-tab-link>
                INVENTORY & LPO
            </a>
        </nav>
        <mat-tab-nav-panel #tabPanel class="docs-component-viewer-content">
            <router-outlet></router-outlet>
        </mat-tab-nav-panel>
      </div>
    </div>
  `,
  styles: `

  .tab-viewer-container {
    position: relative;
    min-height: 500px;
  }
  
  .tab-viewer{
    font-width: 400;
  }

  .active {
    border-bottom: 5px solid blue;
  }

  @media (max-width: 599px){
    
    :host {
      display: flex;
      flex-direction: column;
    }
  }
  
  `
})
export class DashboardTabComponent {

}
