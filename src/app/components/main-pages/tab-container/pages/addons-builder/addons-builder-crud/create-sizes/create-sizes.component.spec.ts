import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSizesComponent } from './create-sizes.component';

describe('CreateSizesComponent', () => {
  let component: CreateSizesComponent;
  let fixture: ComponentFixture<CreateSizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSizesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
