import { Component, inject, Input, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar-component/navbar-component';
import { ProductService } from '../../../core/services/product-service';
import { ProductCardComponent } from '../../../shared/components/product-card-component/product-card-component';
import { Product } from '../../../shared/models/product';
import { CompletableEvent } from '../../../shared/events/completable-event';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductRemovalDialogComponent } from '../components/product-removal-dialog-component/product-removal-dialog-component';
import { DialogConfig } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-component',
  imports: [
    NavbarComponent,
    ProductCardComponent
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent implements OnInit {
  @Input() admin : boolean = false;
  readonly productService = inject(ProductService);
  readonly dialogService = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);

  products = this.productService.getProducts();

  ngOnInit(): void {
    this.productService.listProducts();
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
}
