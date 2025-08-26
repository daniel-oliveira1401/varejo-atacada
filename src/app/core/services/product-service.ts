import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { BASE_URL } from '../../app.config';
import { Product } from '../../shared/models/product';
import { catchError, map, Observable, of } from 'rxjs';

/**
 * Este service utiliza a prática conhecida como "Atualizações Otimistas (Optimistic Updates)" 
 * para fazer o gerenciamento de estado dos produtos.
 * 
 * Motivo: a api não realiza persistência das operações, então para que uma adição ou remoção
 * seja refletida na lista de produtos, o gerênciamento dos itens da lista é feito
 * pelo service no array in-memory enquanto que a operação é enviada para o backend. Caso
 * o backend retorne "ok" para a operação que foi realizada, consideramos que a operação
 * que fizemos no array in-memory do service foi válida. Caso contrário, revertemos para o 
 * estado anterior à operação.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private readonly httpClient : HttpClient,
    @Inject(BASE_URL) private readonly baseUrl : string
  ){}

  private products : WritableSignal<Product[]> = signal([]);

  getProducts() : Signal<Product[]>{
    return this.products.asReadonly();
  }

  listProducts() : void {
    this.httpClient.get<Product[]>(this.baseUrl + "/products").subscribe({
      next: (res)=>{
        this.products.set(res);
      },
      error: (error)=>{
        console.error("Não foi possível obter a lista de produtos", error);
      }
    })
  }

  getProduct(id : number) : Observable<Product>{
    return this.httpClient.get<Product>(this.baseUrl + "/products/" + id);
  }

  /**
   * Esta operação remove o produto do array in-memory de produtos. Uma chamada em
   * `listProducts()` reverte esta operação.
   * @param id id do produto para remover in-memory
   */
  removeProduct(id : number) : Observable<boolean> {
    const productsBeforeRemoval = [...this.products()];

    const productsAfterRemoval = [...this.products()].filter((p) => p.id != id);
    
    this.products.set(productsAfterRemoval);

    return this.httpClient.delete(this.baseUrl + `/products/${id}`).pipe(
      map(r => true),
      catchError((error)=>{
        console.error("Não foi possível remover o produto", error);
        //reverter a operação caso o servidor retorne erro
        this.products.set(productsBeforeRemoval);

        return of(false);
      })
    );
  }

}
