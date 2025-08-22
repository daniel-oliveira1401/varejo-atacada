import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { LoadingIndicatorService } from './core/services/loading-indicator-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressBarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  loadingIndicatorService = inject(LoadingIndicatorService);
  loading = this.loadingIndicatorService.isLoading;

}
