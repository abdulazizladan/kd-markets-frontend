import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsCreateInvoiceComponent } from './payments-create-invoice-component';

describe('PaymentsCreateInvoiceComponent', () => {
  let component: PaymentsCreateInvoiceComponent;
  let fixture: ComponentFixture<PaymentsCreateInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsCreateInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsCreateInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
