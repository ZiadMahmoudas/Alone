import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateProduct } from './generate-product';

describe('GenerateProduct', () => {
  let component: GenerateProduct;
  let fixture: ComponentFixture<GenerateProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
