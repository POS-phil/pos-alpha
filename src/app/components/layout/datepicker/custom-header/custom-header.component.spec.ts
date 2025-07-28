import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHeaderComponent } from './custom-header.component';

describe('CustomHeaderComponent', () => {
  let component: CustomHeaderComponent<any>;
  let fixture: ComponentFixture<CustomHeaderComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
