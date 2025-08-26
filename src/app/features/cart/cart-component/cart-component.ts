import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart-service';
import { NavbarComponent } from "../../../shared/components/navbar-component/navbar-component";
import { ProductGroup } from '../../../shared/models/product-group';
import { CartProductCardComponent } from '../components/cart-product-card-component/cart-product-card-component';

@Component({
  selector: 'app-cart-component',
  imports: [NavbarComponent, CartProductCardComponent, RouterModule, CurrencyPipe, MatButtonModule, MatCardModule],
  templateUrl: './cart-component.html',
  styleUrl: './cart-component.scss'
})
export class CartComponent {
  readonly cartService = inject(CartService);
  readonly snackbar = inject(MatSnackBar);
  readonly cartProducts = this.cartService.getCartProducts();
  readonly productGroups = computed(()=> {
    const productGroups : ProductGroup[] = [];

    this.cartProducts().forEach((p)=>{
      const productId = p.id;

      const existingProductGroup = productGroups.find(p => p.product.id == productId);
      
      if(existingProductGroup){
        existingProductGroup.increaseCount();
      }else{
        productGroups.push(new ProductGroup(p));
      }

    });

    return productGroups;
  });

  increaseCount(productGroup : ProductGroup){
    this.cartService.increaseCount(productGroup);
  }

  decreaseCount(productGroup : ProductGroup){
    this.cartService.decreaseCount(productGroup);
  }

  removeFromCart(productGroup : ProductGroup){
    this.cartService.removeFromCart(productGroup.product.id).subscribe({
      next: ()=>{
        this.snackbar.open('Removido do carrinho');
      }
    });
  }

}
