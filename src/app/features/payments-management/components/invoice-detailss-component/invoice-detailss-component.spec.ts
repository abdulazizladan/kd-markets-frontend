import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDetailssComponent } from './invoice-detailss-component';

describe('InvoiceDetailssComponent', () => {
  let component: InvoiceDetailssComponent;
  let fixture: ComponentFixture<InvoiceDetailssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceDetailssComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceDetailssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
