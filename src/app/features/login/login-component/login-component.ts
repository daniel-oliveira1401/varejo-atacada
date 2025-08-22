import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../../core/services/auth-service';
import { LogoComponent } from "../../../shared/components/logo-component/logo-component";

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
    LogoComponent
],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent {
  readonly authService = inject(AuthService);

  readonly loginForm = new FormGroup<LoginForm>({
    username : new FormControl<string | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null, [Validators.required])
  });

  login(){
    if(this.loginForm.valid){
      const username = this.loginForm.controls.username.value!;
      const password = this.loginForm.controls.password.value!;

      this.authService.login(username, password);

    }
  }

}
