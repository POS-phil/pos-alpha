import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierGroupComponent } from './modifier-group.component';

describe('ModifierGroupComponent', () => {
  let component: ModifierGroupComponent;
  let fixture: ComponentFixture<ModifierGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
