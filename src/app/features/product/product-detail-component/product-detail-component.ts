import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar-component/navbar-component';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../shared/models/product';
import { ProductCardComponent } from "../../../shared/components/product-card-component/product-card-component";

@Component({
  selector: 'app-product-detail-component',
  imports: [NavbarComponent, ProductCardComponent],
  templateUrl: './product-detail-component.html',
  styleUrl: './product-detail-component.scss'
})
export class ProductDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  product : WritableSignal<Product | undefined> = signal(undefined);
  products = this.productService.getProducts();

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params)=>{
        const productId : number = params['id'];    
        if(productId){
          this.productService.getProduct(productId).subscribe({
            next: (product)=>{
              this.product.set(product);
            },
            error(err) {
              console.log("Couldn't find product with id ", productId, err);
            },
          })
        }
      }
    });
    
    
    this.productService.listProducts();

  }
}
