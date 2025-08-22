import { Component, inject } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { LogoComponent } from "../logo-component/logo-component";

@Component({
  selector: 'app-navbar-component',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    LogoComponent
],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss'
})
export class NavbarComponent {

  readonly authService = inject(AuthService);
  userIsLoggedIn = this.authService.userIsLoggedIn();

  getLoggedInUserInitial(){
    const user = this.authService.getLoggedInUser();

    if(user)
      return user.username.at(0)!.toUpperCase();

    return '?';
  }

  logout(){
    this.authService.logout();
  }

}
