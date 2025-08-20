import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModifierGroupComponent } from './edit-modifier-group.component';

describe('EditModifierGroupComponent', () => {
  let component: EditModifierGroupComponent;
  let fixture: ComponentFixture<EditModifierGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditModifierGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditModifierGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
