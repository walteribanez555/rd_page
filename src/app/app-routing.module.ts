import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { dashboardGuard } from './Modules/Auth/Guards/Dashboard.guard';
import { NotFoundComponent } from './Modules/shared/Pages/notFound/notFound.component';
import { ConfirmPaymentComponent } from './Modules/shared/Pages/confirm-payment/confirm-payment.component';

const routes: Routes = [
  {
    path : '',
    redirectTo : 'cotizar',
    pathMatch : 'full',
  },

  {
    path : 'cotizacion',
    loadChildren : ()  => import('./Modules/cotizacion/cotizacion.module').then(m => m.CotizacionModule)
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
