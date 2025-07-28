import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetSalesComponent } from './net-sales.component';

describe('NetSalesComponent', () => {
  let component: NetSalesComponent;
  let fixture: ComponentFixture<NetSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
