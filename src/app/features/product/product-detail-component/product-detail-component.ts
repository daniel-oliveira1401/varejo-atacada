import { Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar-component/navbar-component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../shared/models/product';
import { ProductCardComponent } from "../../../shared/components/product-card-component/product-card-component";
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../../core/services/cart-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CompletableEvent } from '../../../shared/events/completable-event';
import { AuthService } from '../../../core/services/auth-service';

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
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  readonly userIsLoggedIn = this.authService.userIsLoggedIn();
  readonly product : WritableSignal<Product | undefined> = signal(undefined);
  readonly products = computed(() => {
    const allProducts = this.productService.getProducts()();
    return allProducts.filter(p => p.id != this.product()?.id);
  });
  
  readonly notFound = signal(false);
  readonly snackbarService = inject(MatSnackBar);
  readonly component : ElementRef<HTMLElement> = inject(ElementRef);

  routeParamsSubscription : Subscription | undefined;

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
                this.component.nativeElement.scrollTo({top: 0, left: 0, behavior: 'smooth'});
              }else{
                this.notFound.set(true);
              }
            },
            error(err) {
              console.error("Não foi possível encontrar o produto com id ", productId, err);
            },
          })
        }
      }
    });
    
    
    this.productService.listProducts();

  }

  addToCart(productEvent : CompletableEvent<Product>){
    if(this.userIsLoggedIn()){
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
    }else{
      productEvent.complete(true);

      this.router.navigate(["/login"], {
        queryParams: {
          redirectUri : `/product/`+productEvent.eventData.id
        }
      });

    }
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
  }
}
