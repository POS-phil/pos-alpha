import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingVerificationComponent } from './sorting-verification.component';

describe('SortingVerificationComponent', () => {
  let component: SortingVerificationComponent;
  let fixture: ComponentFixture<SortingVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortingVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortingVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
