import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../shared/models/product';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { ProductGroup } from '../../../../shared/models/product-group';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-product-card-component',
  imports: [MatChipsModule, MatIconModule, MatButtonModule, MatCardModule, CurrencyPipe],
  templateUrl: './cart-product-card-component.html',
  styleUrl: './cart-product-card-component.scss'
})
export class CartProductCardComponent {
  @Input({required : true}) productGroup! : ProductGroup;

  @Output() increaseCount : EventEmitter<ProductGroup> = new EventEmitter();
  @Output() decreaseCount : EventEmitter<ProductGroup> = new EventEmitter();
  @Output() removeAllFromCart : EventEmitter<ProductGroup> = new EventEmitter();
  @Output() removeOneFromCart : EventEmitter<ProductGroup> = new EventEmitter();

  getTotalCostForProducts(){
    return this.productGroup.product.price * this.productGroup.count;
  }

  getProductTitle(){
    return this.productGroup.product.title;
  }

  getProductAmount(){
    return this.productGroup.count;
  }

  getProductCategory(){
    return this.productGroup.product.category;
  }

  getProductImage(){
    return this.productGroup.product.image;
  }

  getProductDescription(){
    return this.productGroup.product.description;
  }

  triggerIncreaseCountEvent(){
    this.increaseCount.emit(this.productGroup);
  }

  triggerDecreaseCountEvent(){
    this.decreaseCount.emit(this.productGroup);
  }

  triggerRemoveFromCart(){
    this.removeAllFromCart.emit(this.productGroup);
  }

  triggerRemoveOneFromCart(){
    this.removeOneFromCart.emit(this.productGroup);
  }

}
