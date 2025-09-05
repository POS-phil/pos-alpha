import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySortLevel2Component } from './category-sort-level2.component';

describe('CategorySortLevel2Component', () => {
  let component: CategorySortLevel2Component;
  let fixture: ComponentFixture<CategorySortLevel2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySortLevel2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySortLevel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
