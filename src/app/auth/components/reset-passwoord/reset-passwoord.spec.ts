import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswoord } from './reset-passwoord';

describe('ResetPasswoord', () => {
  let component: ResetPasswoord;
  let fixture: ComponentFixture<ResetPasswoord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetPasswoord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswoord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
