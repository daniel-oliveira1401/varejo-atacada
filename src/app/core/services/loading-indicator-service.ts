import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingIndicatorService {
  activeRequests = signal(0);

  isLoading = computed(()=> this.activeRequests() > 0);

  incrementPendingRequests(){
    this.activeRequests.set(this.activeRequests() + 1);
  }

  decrementPendingRequests(){
    this.activeRequests.set(this.activeRequests() - 1);
  }
}
