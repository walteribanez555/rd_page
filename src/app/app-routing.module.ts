import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './Modules/shared/pages/notFound/notFound.component';
import { ConfirmPaymentComponent } from './Modules/shared/pages/confirm-payment/confirm-payment.component';
import { dashboardGuard } from './Modules/Auth/Guards/Dashboard.guard';

const routes: Routes = [
  {
    path : '',
    redirectTo : 'cotizar',
    pathMatch : 'full',
  },
  {
    path : 'cotizar',
    loadChildren : () => import('./Modules/Landing-page/landing-page.module').then(m => m.LandingPageModule)
  },
  {
    path : 'confirm-payment',
    component : ConfirmPaymentComponent,

  },
  {
    canActivate : [dashboardGuard],
    path : 'dashboard',
    loadChildren : () => import('./Modules/dashboard/dashboard.module').then( m => m.DashboardModule),
  },
  {
    path : 'auth',
    loadChildren : () => import('./Modules/Auth/auth.module').then( m=> m.AuthModule),
  },
  {
    path :'404',
    component : NotFoundComponent,

  },
  {
    path : '**',
    component : NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
