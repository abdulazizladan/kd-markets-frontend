import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketsListComponent } from './components/markets-list-component/markets-list-component';
import { MarketDetailsComponent } from './components/market-details-component/market-details-component';

const routes: Routes = [
  {
    path: "",
    component: MarketsListComponent
  },
  {
    path: "market/:id",
    component: MarketDetailsComponent
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketsManagementRoutingModule { }
