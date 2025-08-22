import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentsSummaryComponent } from './components/payments-summary-component/payments-summary-component';

const routes: Routes = [
  {
    path: '',
    component: PaymentsSummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsManagementRoutingModule { }
