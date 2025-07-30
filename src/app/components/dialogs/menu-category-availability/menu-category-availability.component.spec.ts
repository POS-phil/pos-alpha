import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCategoryAvailabilityComponent } from './menu-category-availability.component';

describe('MenuCategoryAvailabilityComponent', () => {
  let component: MenuCategoryAvailabilityComponent;
  let fixture: ComponentFixture<MenuCategoryAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuCategoryAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuCategoryAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
