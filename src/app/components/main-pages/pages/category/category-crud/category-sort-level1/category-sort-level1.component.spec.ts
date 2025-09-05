import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySortLevel1Component } from './category-sort-level1.component';

describe('CategorySortLevel1Component', () => {
  let component: CategorySortLevel1Component;
  let fixture: ComponentFixture<CategorySortLevel1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySortLevel1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySortLevel1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
