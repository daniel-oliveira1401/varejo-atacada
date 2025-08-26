import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Product } from '../../models/product';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { CompletableEvent } from '../../events/completable-event';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-card-component',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    CurrencyPipe,
    MatChipsModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatIconModule
],
  templateUrl: './product-card-component.html',
  styleUrl: './product-card-component.scss'
})
export class ProductCardComponent {
  @Input({required : true}) product! : Product;
  @Input() showAddToCartBtn : boolean = false;
  @Input() showRemoveProductBtn : boolean = false;
  @Input() showDescription : boolean = false;
  @Input() withLink : boolean = true;
  @Input() showHover : boolean = true;
  @Input() clampImageSize : boolean = true;
  
  @Output() addToCart : EventEmitter<CompletableEvent<Product>> = new EventEmitter<CompletableEvent<Product>>(); 
  @Output() removeProduct : EventEmitter<CompletableEvent<Product>> = new EventEmitter<CompletableEvent<Product>>(); 

  readonly loading = signal(false);

  triggerAddToCartEvent(){
    
    this.loading.set(true);
    
    const addToCartEvent =  new CompletableEvent(this.product, (result)=> {
      this.loading.set(false);
    });

    this.addToCart.emit(addToCartEvent);
  }

  triggerRemoveProductEvent(){
    
    this.loading.set(true);
    
    const removeProductEvent =  new CompletableEvent(this.product, (result)=> {
      this.loading.set(false);
    });

    this.removeProduct.emit(removeProductEvent);
  }

}
