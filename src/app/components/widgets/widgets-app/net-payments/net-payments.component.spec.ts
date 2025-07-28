import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetPaymentsComponent } from './net-payments.component';

describe('NetPaymentsComponent', () => {
  let component: NetPaymentsComponent;
  let fixture: ComponentFixture<NetPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
