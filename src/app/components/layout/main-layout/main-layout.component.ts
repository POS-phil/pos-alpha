import { Component, Input, viewChild, ViewChild } from '@angular/core';
import { TopNavComponent } from '../top-nav/top-nav.component';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    SideNavComponent,
    TopNavComponent
],
  template: `
    <app-top-nav (toggleSidenav)="onToggleSidenav()" />
    <app-side-nav #sideNav />
  `,
  styles: ``
})
export class MainLayoutComponent {

  @ViewChild(SideNavComponent) sideNav!: SideNavComponent;

  onToggleSidenav() {
    if (this.sideNav) {
      this.sideNav.toggleSidenav();      
    }
  }

}
