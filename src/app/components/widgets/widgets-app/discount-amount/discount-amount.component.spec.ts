import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountAmountComponent } from './discount-amount.component';

describe('DiscountAmountComponent', () => {
  let component: DiscountAmountComponent;
  let fixture: ComponentFixture<DiscountAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
