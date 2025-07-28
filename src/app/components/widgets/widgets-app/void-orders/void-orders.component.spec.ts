import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidOrdersComponent } from './void-orders.component';

describe('VoidOrdersComponent', () => {
  let component: VoidOrdersComponent;
  let fixture: ComponentFixture<VoidOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoidOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoidOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
