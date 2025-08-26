import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRemovalDialogComponent } from './product-removal-dialog-component';

describe('ProductRemovalDialogComponent', () => {
  let component: ProductRemovalDialogComponent;
  let fixture: ComponentFixture<ProductRemovalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRemovalDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRemovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
