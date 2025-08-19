import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { BASE_URL } from '../../app.config';
import { Product } from '../../shared/models/product';
import { Observable } from 'rxjs';

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
   * @param id id do parametro para remover in-memory
   */
  removeProduct(id : number) : void {
    this.products.set(this.products().filter((p) => p.id != id));
  }

}
