import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar'

import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './components/login/login';
import { ResetPasswoord } from './components/reset-passwoord/reset-passwoord';


@NgModule({
  providers:[
  ],
  declarations: [
    Login,
    ResetPasswoord
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
