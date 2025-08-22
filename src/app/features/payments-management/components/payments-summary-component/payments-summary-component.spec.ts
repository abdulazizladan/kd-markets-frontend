import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsSummaryComponent } from './payments-summary-component';

describe('PaymentsSummaryComponent', () => {
  let component: PaymentsSummaryComponent;
  let fixture: ComponentFixture<PaymentsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
