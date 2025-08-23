import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesListsComponent } from './invoices-lists-component';

describe('InvoicesListsComponent', () => {
  let component: InvoicesListsComponent;
  let fixture: ComponentFixture<InvoicesListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoicesListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicesListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
