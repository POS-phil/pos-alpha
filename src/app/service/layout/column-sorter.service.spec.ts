import { TestBed } from '@angular/core/testing';

import { ColumnSorterService } from './column-sorter.service';

describe('ColumnSorterService', () => {
  let service: ColumnSorterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColumnSorterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
