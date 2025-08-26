import { HttpClient } from '@angular/common/http';
import { computed, Inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Product } from '../../shared/models/product';
import { UpdateCartRequest } from '../../shared/models/api/update-cart-request';
import { AuthService } from './auth-service';
import { BASE_URL } from '../../app.config';
import { catchError, map, of } from 'rxjs';
import { ProductGroup } from '../../shared/models/product-group';

/**
 * Este service utiliza a prática conhecida como "Atualizações Otimistas (Optimistic Updates)" 
 * para fazer o gerenciamento de estado do carrinho.
 * 
 * Motivo: a api não realiza persistência das operações, então para que uma adição ou remoção
 * seja refletida na lista de itens do carrinho, o gerênciamento dos itens da lista é feito
 * pelo service no array in-memory enquanto que a operação é enviada para o backend. Caso
 * o backend retorne "ok" para a operação que foi realizada, consideramos que a operação
 * que fizemos no array in-memory do service foi válida. Caso contrário, revertemos para o 
 * estado anterior à operação.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(
    private readonly httpClient : HttpClient,
    private readonly authService : AuthService,
    @Inject(BASE_URL) private readonly baseUrl : string
  ){}

  private readonly cartProducts : WritableSignal<Product[]> = signal([]);
  private readonly totalCost = computed(() => {
    return this.cartProducts().reduce((cost, produto)=> {
      return cost += produto.price;
    }, 0);
  });

  getTotalCost(){
    return this.totalCost();
  }

  getCartProducts(){
    return this.cartProducts.asReadonly();
  }

  hasItemsInCart(){
    return this.cartProducts().length > 0;
  }

  getCartItemsCount(){
    return this.cartProducts().length;
  }

  addToCart(product : Product){
    
    const productsBeforeUpdate = [...this.cartProducts()];
    
    const productsAfterUpdate = [...productsBeforeUpdate, product];

    this.cartProducts.set(productsAfterUpdate);
    
    return this.updateCart(productsAfterUpdate, productsBeforeUpdate);
  }

  increaseCount(productGroup : ProductGroup){
    this.addToCart(productGroup.product).subscribe({
      next: (result)=>{
        productGroup.increaseCount();
      }
    });
  }

  removeFromCart(productId : number){
    
    const productsBeforeRemoval = [...this.cartProducts()];
    
    const productsAfterRemoval = [...this.cartProducts()].filter((p) => p.id != productId);
    
    this.cartProducts.set(productsAfterRemoval);

    return this.updateCart(productsAfterRemoval, productsBeforeRemoval);
  }

  decreaseCount(productGroup : ProductGroup){
    
    this.removeFromCart(productGroup.product.id).subscribe({
      next: (result)=>{
        productGroup.decreaseCount();
      }
    });

  }

  private updateCart(desiredState : Product[], previousState : Product[]){
    const user = this.authService.getLoggedInUser();
    
    if(!user){
      throw new Error('É necessário um usuário logado para realizar esta operação');
    }
    
    const request = new UpdateCartRequest(
      1, // numero do carrinho não importa por conta de que a API não faz persistência
      user.id,
      desiredState
    );
    
    // numero do carrinho não importa por conta de que a API não faz persistência
    return this.httpClient.put(this.baseUrl + "/carts/1", request).pipe(
      map(r => true),
      catchError((error) => {
        
        console.error("Não foi possível atualizar o carrinho", error);
        //reverter a atualização otimista caso a operação falhe
        this.cartProducts.set(previousState);
        
        return of(false);
      })
    );
  }
}
