import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AdminRoutingModule } from './admin-routing-module';
import { LayoutComponent } from './components/layout-component/layout-component';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';

@NgModule({
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  declarations: [
    LayoutComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressBarModule,
    MatExpansionModule,
    BaseChartDirective,
    AdminRoutingModule
  ]
})
export class AdminModule { }
