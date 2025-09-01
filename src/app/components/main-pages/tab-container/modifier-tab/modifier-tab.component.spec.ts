import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierTabComponent } from './modifier-tab.component';

describe('ModifierTabComponent', () => {
  let component: ModifierTabComponent;
  let fixture: ComponentFixture<ModifierTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
