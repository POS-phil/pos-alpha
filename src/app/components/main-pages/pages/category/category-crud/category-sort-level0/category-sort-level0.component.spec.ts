import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySortLevel0Component } from './category-sort-level0.component';

describe('CategorySortLevel0Component', () => {
  let component: CategorySortLevel0Component;
  let fixture: ComponentFixture<CategorySortLevel0Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySortLevel0Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySortLevel0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
