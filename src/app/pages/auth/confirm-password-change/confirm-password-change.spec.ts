import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPasswordChange } from './confirm-password-change';

describe('ConfirmPasswordChange', () => {
  let component: ConfirmPasswordChange;
  let fixture: ComponentFixture<ConfirmPasswordChange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmPasswordChange]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmPasswordChange);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
