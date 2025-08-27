import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../../core/services/auth-service';
import { LogoComponent } from "../../../shared/components/logo-component/logo-component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { finalize, Subscription } from 'rxjs';


type LoginForm = {
  username : FormControl<string | null>,
  password : FormControl<string | null>
};

@Component({
  selector: 'app-login-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    LogoComponent,
    RouterModule
],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly loginFailed = signal(false);
  readonly loading = signal(false);
  readonly loginForm = new FormGroup<LoginForm>({
    username : new FormControl<string | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null, [Validators.required])
  });
  readonly redirect = signal('/home');

  routeParamsSubscription : Subscription | undefined;

  ngOnInit(): void {
    this.routeParamsSubscription = this.route.queryParams.subscribe((params : Params)=>{
      const redirectUri = params['redirectUri'];
      
      if(redirectUri){
        this.redirect.set(redirectUri);
      }
    });
  }

  login(){
    if(this.loginForm.valid){
      const username = this.loginForm.controls.username.value!;
      const password = this.loginForm.controls.password.value!;
      this.loading.set(true);
      this.authService.login(username, password).pipe(
        finalize(() => {
          this.loading.set(false);
        })
      ).subscribe({
        next: ()=>{
          this.loginFailed.set(false);
          
          this.router.navigateByUrl(this.redirect());
        },
        error: (error)=>{
          this.loginFailed.set(true);
        }
      });

    }
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
  }

}
