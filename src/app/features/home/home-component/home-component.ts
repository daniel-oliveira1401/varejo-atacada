import { AfterViewInit, Component, computed, ElementRef, inject, Input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar-component/navbar-component';
import { ProductService } from '../../../core/services/product-service';
import { ProductCardComponent } from '../../../shared/components/product-card-component/product-card-component';
import { Product } from '../../../shared/models/product';
import { CompletableEvent } from '../../../shared/events/completable-event';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductRemovalDialogComponent } from '../components/product-removal-dialog-component/product-removal-dialog-component';
import { DialogConfig } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../../core/services/auth-service';
import { debounceTime, fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-home-component',
  imports: [
    NavbarComponent,
    ProductCardComponent,
    MatInputModule,
    MatFormFieldModule
],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() admin : boolean = false;
  readonly authService = inject(AuthService);
  readonly userIsLoggedIn = this.authService.userIsLoggedIn();
  readonly productService = inject(ProductService);
  readonly dialogService = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  readonly products = this.productService.getProducts();
  readonly filterValue = signal('');
  readonly productsToDisplay = computed(()=>{
    
    const allProducts = [...this.products()];

    return allProducts.filter((product)=>{
      return product.title.toLowerCase().includes(this.filterValue().toLowerCase());
    });
  });

  @ViewChild("search", {static: true}) search! : ElementRef<HTMLInputElement>;
  filterSubscription : Subscription | undefined;

  ngOnInit(): void {
    this.productService.listProducts();
  }

  ngAfterViewInit(): void {
    this.filterSubscription = fromEvent(this.search.nativeElement, 'input')
    .pipe(
      debounceTime(250)
    )
    .subscribe(()=>{
      this.filterValue.set(this.search.nativeElement.value);
    });
  }

  removeProduct(removeProductEvent : CompletableEvent<Product>){
    const dialogConfig : MatDialogConfig<Product> = {
      data: removeProductEvent.eventData,
      maxHeight: '100vh'
    };

    const dialogRef = this.dialogService.open<ProductRemovalDialogComponent, Product, boolean>(ProductRemovalDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((accepted)=>{
      if(accepted){
        this.productService.removeProduct(removeProductEvent.eventData.id).subscribe(()=>{
          this.snackBar.open('Produto removido da loja');
          removeProductEvent.complete(true);
        });
      }
      removeProductEvent.complete(true);
    });

    
  }

  ngOnDestroy(): void {
      this.filterSubscription?.unsubscribe();
  }
}
