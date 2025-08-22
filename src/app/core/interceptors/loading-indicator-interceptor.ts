import { HttpInterceptorFn } from '@angular/common/http';
import { inject, NgZone } from '@angular/core';
import { tap } from 'rxjs';
import { LoadingIndicatorService } from '../services/loading-indicator-service';

export const loadingIndicatorInterceptor: HttpInterceptorFn = (req, next) => {
  const ngZone = inject(NgZone);
  const loaderIndicatorService = inject(LoadingIndicatorService);
  
  ngZone.run(()=>{
    loaderIndicatorService.incrementPendingRequests();
  });
  
  return next(req).pipe(tap({
    next: ()=>{
      ngZone.run(()=>{
        loaderIndicatorService.decrementPendingRequests();
      });
    },
    error: ()=>{
      ngZone.run(()=>{
        loaderIndicatorService.decrementPendingRequests();
      });
    }
  }));
};
