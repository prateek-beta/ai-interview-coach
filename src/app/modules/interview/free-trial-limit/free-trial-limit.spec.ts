import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTrialLimit } from './free-trial-limit';

describe('FreeTrialLimit', () => {
  let component: FreeTrialLimit;
  let fixture: ComponentFixture<FreeTrialLimit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeTrialLimit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeTrialLimit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
