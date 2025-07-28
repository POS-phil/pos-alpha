import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-tab',
  standalone: true,
  imports: [
    MatTabsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './menu-tab.component.html',
  styleUrl: './menu-tab.component.scss'
})
export class MenuTabComponent {

}
