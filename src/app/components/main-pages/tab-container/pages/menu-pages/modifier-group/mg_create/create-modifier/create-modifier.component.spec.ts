import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModifierComponent } from './create-modifier.component';

describe('CreateModifierComponent', () => {
  let component: CreateModifierComponent;
  let fixture: ComponentFixture<CreateModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateModifierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
