import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card-component',
  imports: [CommonModule, MatCardModule, MatButtonModule, CurrencyPipe, MatChipsModule, RouterModule],
  templateUrl: './product-card-component.html',
  styleUrl: './product-card-component.scss'
})
export class ProductCardComponent {
  @Input({required : true}) product! : Product;
  @Input() showAddToKartBtn : boolean = false;
  @Input() showDescription : boolean = false;
  @Input() withLink : boolean = true;
  @Input() showHover : boolean = true;
  @Input() clampImageSize : boolean = true;

}
