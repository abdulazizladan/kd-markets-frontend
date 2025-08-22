import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsManagementRoutingModule } from './payments-management-routing-module';
import { PaymentsSummaryComponent } from './components/payments-summary-component/payments-summary-component';
import { PaymentsCreateInvoiceComponent } from './components/payments-create-invoice-component/payments-create-invoice-component';



@NgModule({
  declarations: [
    PaymentsSummaryComponent,
    PaymentsCreateInvoiceComponent
  ],
  imports: [
    CommonModule,
    PaymentsManagementRoutingModule
  ]
})
export class PaymentsManagementModule { }
