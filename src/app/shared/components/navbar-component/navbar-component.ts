import { Component, inject } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { LogoComponent } from "../logo-component/logo-component";
import { CartService } from '../../../core/services/cart-service';
import {MatBadgeModule} from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar-component',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    RouterModule,
    LogoComponent
],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss'
})
export class NavbarComponent {

  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);

  userIsLoggedIn = this.authService.userIsLoggedIn();

  logout(){
    this.authService.logout();
  }

}
