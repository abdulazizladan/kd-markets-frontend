import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentsSummaryComponent } from './components/payments-summary-component/payments-summary-component';
import { PaymentHistoryComponent } from './components/payment-history-component/payment-history-component';

const routes: Routes = [
  {
    path: '',
    component: PaymentsSummaryComponent
  },
  {
    path: 'history',
    component: PaymentHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsManagementRoutingModule { }
