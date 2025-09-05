import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from "./components/layout/main-layout/main-layout.component";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SpinnerLoaderComponent } from './components/layout/spinner-loader/spinner-loader.component';
import { Observable } from 'rxjs';
import { LoadingService } from './components/layout/spinner-loader/LoadingService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSnackBarModule,
    SpinnerLoaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'POS Development Build';

  private router = inject(Router);

  constructor(
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ){ 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.showPageLoading();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hidePageLoading();
      }
    });
   }

  ngOnInit(): void {

  }

}
