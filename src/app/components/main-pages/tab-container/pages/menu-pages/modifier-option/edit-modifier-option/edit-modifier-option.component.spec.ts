import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModifierOptionComponent } from './edit-modifier-option.component';

describe('EditModifierOptionComponent', () => {
  let component: EditModifierOptionComponent;
  let fixture: ComponentFixture<EditModifierOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditModifierOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditModifierOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
