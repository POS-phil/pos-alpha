import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-modifier-tab',
    standalone: true,
  imports: [
    RouterModule,
    MatTabsModule,
    CommonModule,

  ],
  templateUrl: './modifier-tab.component.html',
  styleUrls: ['./modifier-tab.component.scss']
})
export class ModifierTabComponent {

}
