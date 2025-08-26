import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar-component/navbar-component';
import { ProductCardComponent } from '../../../shared/components/product-card-component/product-card-component';
import { HomeComponent } from '../../home/home-component/home-component';

@Component({
  selector: 'app-admin-component',
  imports: [
    HomeComponent
  ],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.scss'
})
export class AdminComponent {

}
