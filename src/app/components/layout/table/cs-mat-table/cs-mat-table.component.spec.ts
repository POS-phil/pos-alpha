import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsMatTableComponent } from './cs-mat-table.component';

describe('CsMatTableComponent', () => {
  let component: CsMatTableComponent;
  let fixture: ComponentFixture<CsMatTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsMatTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsMatTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
