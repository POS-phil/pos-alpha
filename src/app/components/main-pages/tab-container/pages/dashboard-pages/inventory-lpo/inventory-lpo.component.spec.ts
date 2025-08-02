import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryLpoComponent } from './inventory-lpo.component';

describe('InventoryLpoComponent', () => {
  let component: InventoryLpoComponent;
  let fixture: ComponentFixture<InventoryLpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryLpoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryLpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
