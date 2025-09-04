import { inject, Injectable } from '@angular/core';
import {
    HttpErrorResponse,
  HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, retry } from 'rxjs/operators';
import { LoadingService } from './LoadingService';
import { Router } from '@angular/router';

export const loadingSpinnerInterceptorFunctional: HttpInterceptorFn = (req, next) => {
  const exemptedRoutes = ['/monitor'];
  const router = inject(Router);
  const currentRoute = router.url;

  const loadingService = inject(LoadingService); // Instantiate the loading service

  // Check if the current route is in the exempted list
  if (!exemptedRoutes.includes(currentRoute)) {
    loadingService.showLoadingSpinner();
  }

  return next(req).pipe(
    finalize(() => {
      if (!exemptedRoutes.includes(currentRoute)) {
        loadingService.hideLoadingSpinner();
      }
    })
  );
};

export const retryInterceptorFunctional: HttpInterceptorFn = (req, next) => {
  const maxRetries = 3;

  return next(req).pipe(
    retry(maxRetries),
    catchError((error: HttpErrorResponse) => {
      console.error('Retry Interceptor Functional Error:', error);
      return throwError(() => error);
    })
  );
};