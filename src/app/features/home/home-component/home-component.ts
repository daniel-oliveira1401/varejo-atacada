import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar-component/navbar-component';
import { ProductService } from '../../../core/services/product-service';
import { ProductCardComponent } from '../../../shared/components/product-card-component/product-card-component';

@Component({
  selector: 'app-home-component',
  imports: [
    NavbarComponent,
    ProductCardComponent
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent implements OnInit {
  productService = inject(ProductService);
  products = this.productService.getProducts();

  ngOnInit(): void {
    this.productService.listProducts();
  }
}
