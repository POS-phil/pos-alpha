import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <nav class="dash-navbar-header">
        <button mat-icon-button class="burger-hidden" (click)="toggleSidenav.emit()">
            <mat-icon>menu</mat-icon>
        </button>
        <span class="spacer"></span>
        <button mat-icon-button class="iconColor" matTooltip="Menu">
            <mat-icon>apps</mat-icon>
        </button>
        <button mat-icon-button class="iconColor" matTooltip="Notifications">
            <mat-icon>notifications</mat-icon>
        </button>
        <button mat-icon-button class="iconColor" matTooltip="Account">
            <mat-icon>person</mat-icon>
        </button>
    </nav>
    
  `,
  styles: `

  :host {
    color: var(--mat-sys-primary);
    background: var(--mat-sys-primary-container);
    border-bottom: 1px solid;
    border-color: var(--mat-sys-outline-variant);
  }

  .dash-navbar-header{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 8px 16px;
  }

  .spacer {
    flex-grow: 1;
  }

  .iconColor {
    color: var(--mat-sys-primary);
    margin-left: 2px;
    margin-right: 15px;
  }

  @media (min-width: 721px) and (max-width: 959px) {
    .burger-hidden {
      display: none !important;
    }
  }


  `
})
export class TopNavComponent {

  @Output() toggleSidenav = new EventEmitter<void>();

}
