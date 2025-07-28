import { AfterViewInit, ChangeDetectorRef, Component, OnInit, output, viewChild, ViewChild, ViewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Params, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';
import { SideNavContentComponent } from "../side-nav-content/side-nav-content.component";
import { FooterComponent } from "../footer/footer.component";
import { DashboardTabComponent } from "../../main-pages/tab-container/dashboard-tab/dashboard-tab.component";
import { LayoutService } from '../../../service/layout/layout.service';

const EXTRA_SMALL_WIDTH_BREAKPOINT = 720;
const SMALL_WIDTH_BREAKPOINT = 959;

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSidenavModule,
    AsyncPipe,
    SideNavContentComponent,
    FooterComponent,
    RouterOutlet,
  ],
  template: `
  
  <mat-sidenav-container class="dash-viewer-sidenav-container">
    @if (isExtraScreenSmall | async){
      <mat-sidenav #sidenav class="dash-sidenav-viewer"
      [opened]="(isExtraScreenSmall | async) === false"
      [mode]="(isExtraScreenSmall | async) ? 'over' : 'side'"
      [fixedInViewport]="(isExtraScreenSmall | async)"
      [fixedTopGap]="(isExtraScreenSmall | async) ? 56 : 56"
      >
        <app-side-nav-content/>
      </mat-sidenav>
    }
    <div class="dash-sidenav-content">
      <div class="dash-sidenav-inner-content">
        <main class="dash-sidenav-body-content">
              @if ((isExtraScreenSmall | async) === false) {
                <app-side-nav-content #sideNavContent />
              }
          <div class="dash-content-viewer">    
            <router-outlet></router-outlet>
          </div>
        </main>
        <app-footer class="dash-viewer-footer" />
      </div>
    </div>
  </mat-sidenav-container>
    
  `,
  styleUrl: '../main-layout/sidenav-style.scss'
})
export class SideNavComponent implements OnInit {

  readonly sideNav = viewChild(MatSidenav);
  @ViewChild('sideNavContent') sideNavContent!: SideNavContentComponent;

  params: Observable<Params> | undefined;
  isExtraScreenSmall: Observable<boolean>;
  isScreenSmall: Observable<boolean>;

  constructor(
    breakpoints: BreakpointObserver,
    private layoutService : LayoutService
  ) {
    this.isExtraScreenSmall = breakpoints
      .observe(`(max-width: ${EXTRA_SMALL_WIDTH_BREAKPOINT}px)`)
      .pipe(map(breakpoint => breakpoint.matches))

    this.isScreenSmall = breakpoints
      .observe(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`)
      .pipe(map(breakpoint => breakpoint.matches));

  }

  ngOnInit(): void {

  }

  toggleSidenav(): void {

    // Subscribing to isExtraScreenSmall here
    this.isExtraScreenSmall.subscribe(isExtraScreenSmall => {
      if (isExtraScreenSmall) {
        this.sideNav()?.toggle();  // Toggling the sidenav on small screens
      } else {
        if (this.sideNavContent) {
          this.sideNavContent.isCollapsed = !this.sideNavContent.isCollapsed;
        }
        this.layoutService.triggerToggleNested();
      }
    });
  }
}
