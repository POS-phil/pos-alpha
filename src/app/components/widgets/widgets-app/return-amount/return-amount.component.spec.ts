import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnAmountComponent } from './return-amount.component';

describe('ReturnAmountComponent', () => {
  let component: ReturnAmountComponent;
  let fixture: ComponentFixture<ReturnAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
