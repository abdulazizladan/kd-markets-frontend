import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './components/users-list-component/users-list-component';
import { UserDetailsComponent } from './components/user-details-component/user-details-component';

const routes: Routes = [
  {
    path: '',
    component: UsersListComponent
  },
  {
    path: 'user/:id',
    component: UserDetailsComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersManagementRoutingModule { }
