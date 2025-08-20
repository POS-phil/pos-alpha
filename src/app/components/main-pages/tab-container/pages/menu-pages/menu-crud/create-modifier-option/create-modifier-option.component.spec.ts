import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModifierOptionComponent } from './create-modifier-option.component';

describe('CreateModifierOptionComponent', () => {
  let component: CreateModifierOptionComponent;
  let fixture: ComponentFixture<CreateModifierOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateModifierOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateModifierOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
