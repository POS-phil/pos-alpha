import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsComponentComponent } from './widgets-component.component';

describe('WidgetsComponentComponent', () => {
  let component: WidgetsComponentComponent;
  let fixture: ComponentFixture<WidgetsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
