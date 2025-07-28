import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsOptionComponent } from './widgets-option.component';

describe('WidgetsOptionComponent', () => {
  let component: WidgetsOptionComponent;
  let fixture: ComponentFixture<WidgetsOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetsOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
