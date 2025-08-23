import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { PaymentsManagementRoutingModule } from './payments-management-routing-module';
import { PaymentsSummaryComponent } from './components/payments-summary-component/payments-summary-component';
import { PaymentsCreateInvoiceComponent } from './components/payments-create-invoice-component/payments-create-invoice-component';
import { InvoicesListsComponent } from './components/invoices-lists-component/invoices-lists-component';
import { InvoiceDetailssComponent } from './components/invoice-detailss-component/invoice-detailss-component';
import { BillingFormComponent } from './components/billing-form-component/billing-form-component';
import { PaymentHistoryComponent } from './components/payment-history-component/payment-history-component';

@NgModule({
  declarations: [
    PaymentsSummaryComponent,
    PaymentsCreateInvoiceComponent,
    InvoicesListsComponent,
    InvoiceDetailssComponent,
    BillingFormComponent,
    PaymentHistoryComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    BaseChartDirective,
    PaymentsManagementRoutingModule
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
})
export class PaymentsManagementModule { }
