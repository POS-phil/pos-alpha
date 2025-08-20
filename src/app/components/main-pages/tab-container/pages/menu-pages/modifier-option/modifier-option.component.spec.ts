import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierOptionComponent } from './modifier-option.component';

describe('ModifierOptionComponent', () => {
  let component: ModifierOptionComponent;
  let fixture: ComponentFixture<ModifierOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
