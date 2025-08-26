import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../shared/models/product';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductCardComponent } from '../../../../shared/components/product-card-component/product-card-component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-removal-dialog-component',
  imports: [
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    ProductCardComponent,
    MatIconModule
  ],
  templateUrl: './product-removal-dialog-component.html',
  styleUrl: './product-removal-dialog-component.scss'
})
export class ProductRemovalDialogComponent {
  product : Product = inject<Product>(MAT_DIALOG_DATA);
  dialogRef : MatDialogRef<ProductRemovalDialogComponent, boolean> = inject(MatDialogRef<ProductRemovalDialogComponent, boolean>);

  confirm(){
    this.dialogRef.close(true);
  }

  cancel(){
    this.dialogRef.close(false);
  }

}
