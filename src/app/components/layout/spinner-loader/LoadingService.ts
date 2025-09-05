import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _activeRequests = signal(0); // For HTTP
  private _pageLoading = signal(false); // For route navigation

  // Combined signal for the template
  loading = computed(() => this._activeRequests() > 0 || this._pageLoading());

  // HTTP
  showLoadingSpinner() {
    this._activeRequests.set(this._activeRequests() + 1);
  }

  hideLoadingSpinner() {
    this._activeRequests.set(Math.max(this._activeRequests() - 1, 0));
  }

  // Page navigation
  showPageLoading() {
    this._pageLoading.set(true);
  }

  hidePageLoading() {
    this._pageLoading.set(false);
  }
}