import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesListComponent } from './components/activities-list-component/activities-list-component';
import { ActivityDetailsComponent } from './components/activity-details-component/activity-details-component';

const routes: Routes = [
  {
    path: '',
    component: ActivitiesListComponent
  },
  {
    path: ':id',
    component: ActivityDetailsComponent
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
export class ActivitiesManagementRoutingModule { }
