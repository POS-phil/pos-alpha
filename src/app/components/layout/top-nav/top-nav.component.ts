import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatBadgeModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <nav class="dash-navbar-header">
        <button mat-icon-button class="burger-hidden" (click)="toggleSidenav.emit()">
            <mat-icon>menu</mat-icon>
        </button>
        <span class="spacer"></span>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search</mat-label>
          <input matInput matTooltip="Start Typing to Search">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
        <span class="spacer"></span>
        <span class="spacer"></span>
        <span class="spacer"></span>
        <span class="spacer"></span>
        <button mat-icon-button class="iconColor" matTooltip="Menu">
            <mat-icon>apps</mat-icon>
        </button>
        <button mat-icon-button matBadge="7" class="iconColor" matTooltip="Notifications">
            <mat-icon>notifications</mat-icon>
        </button>
        <button mat-icon-button class="iconColor" matTooltip="Account">
            <mat-icon>person</mat-icon>
        </button>
    </nav>
    
  `,
  styleUrl: './top-nav.scss'
})
export class TopNavComponent {

  @Output() toggleSidenav = new EventEmitter<void>();

}
