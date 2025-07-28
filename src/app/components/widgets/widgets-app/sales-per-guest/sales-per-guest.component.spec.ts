import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPerGuestComponent } from './sales-per-guest.component';

describe('SalesPerGuestComponent', () => {
  let component: SalesPerGuestComponent;
  let fixture: ComponentFixture<SalesPerGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesPerGuestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesPerGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
