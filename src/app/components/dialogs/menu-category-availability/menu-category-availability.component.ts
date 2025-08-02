import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-menu-category-availability',
  standalone: true,
  imports: [
    MatSlideToggleModule
  ],
  templateUrl: './menu-category-availability.component.html',
  styleUrl: './menu-category-availability.component.scss'
})
export class MenuCategoryAvailabilityComponent {

}
