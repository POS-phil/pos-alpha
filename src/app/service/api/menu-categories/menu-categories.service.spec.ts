import { TestBed } from '@angular/core/testing';

import { MenuCategoriesService } from './menu-categories.service';

describe('MenuCategoriesService', () => {
  let service: MenuCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
