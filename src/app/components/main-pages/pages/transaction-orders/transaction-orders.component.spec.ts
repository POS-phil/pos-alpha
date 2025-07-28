import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionOrdersComponent } from './transaction-orders.component';

describe('TransactionOrdersComponent', () => {
  let component: TransactionOrdersComponent;
  let fixture: ComponentFixture<TransactionOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
