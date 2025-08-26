import { Component, computed, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar-component/navbar-component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../shared/models/product';
import { ProductCardComponent } from "../../../shared/components/product-card-component/product-card-component";
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../../core/services/cart-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CompletableEvent } from '../../../shared/events/completable-event';

@Component({
  selector: 'app-product-detail-component',
  imports: [
    NavbarComponent, 
    ProductCardComponent, 
    MatButtonModule, 
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-detail-component.html',
  styleUrl: './product-detail-component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  cartService = inject(CartService);
  product : WritableSignal<Product | undefined> = signal(undefined);
  products = computed(() => {
    const allProducts = this.productService.getProducts()();
    return allProducts.filter(p => p.id != this.product()?.id);
  });
  
  notFound = signal(false);
  routeParamsSubscription : Subscription | undefined;
  snackbarService = inject(MatSnackBar);

  ngOnInit(): void {
    this.routeParamsSubscription = this.route.params.subscribe({
      next: (params)=>{
        const productId : number = params['id'];
        if(productId){
          this.notFound.set(false);
          this.product.set(undefined);
          this.productService.getProduct(productId).subscribe({
            next: (product)=>{
              //fakestore api não retorna erro quando o produto não existe.
              // Eles retornarm apenas um product 'null'
              if(product){
                this.product.set(product);
              }else{
                this.notFound.set(true);
              }
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

  addToCart(productEvent : CompletableEvent<Product>){
    let p = new Promise<Product>((resolve, reject)=> resolve({} as Product));
    
    this.cartService.addToCart(productEvent.eventData).subscribe({
      next: (success) => {
        if(success){
          this.snackbarService.open(`Adicionado ao carrinho.`);
        }else{
          this.snackbarService.open(`Não foi possível adicionar ao carrinho.`);
        }
        
        productEvent.complete(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
  }
}
