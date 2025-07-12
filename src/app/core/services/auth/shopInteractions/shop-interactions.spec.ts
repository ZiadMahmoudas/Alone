import { TestBed } from '@angular/core/testing';

import { ShopInteractions } from './shop-interactions';

describe('ShopInteractions', () => {
  let service: ShopInteractions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopInteractions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
