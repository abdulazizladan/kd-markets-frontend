import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MarketsManagementRoutingModule } from './markets-management-routing-module';
import { MarketsListComponent } from './components/markets-list-component/markets-list-component';
import { MarketDetailsComponent } from './components/market-details-component/market-details-component';
import { AddMarketComponent } from './components/add-market-component/add-market-component';


@NgModule({
  providers: [
  ],
  declarations: [
    MarketsListComponent,
    MarketDetailsComponent,
    AddMarketComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MarketsManagementRoutingModule
  ]
})
export class MarketsManagementModule { }
