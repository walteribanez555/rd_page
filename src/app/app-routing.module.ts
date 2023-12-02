import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path : '',
    redirectTo : 'landing-page/home',
    pathMatch : 'full'
  },
  {
    path : 'dashboard',
    loadChildren : () => import('./Modules/dashboard/dashboard.module').then( m => m.DashboardModule)
  },
  {
    path : 'landing-page',
    loadChildren : () => import('./Modules/Landing-page/landing-page.module').then(m => m.LandingPageModule)
  },
  {
    path : 'auth',
    loadChildren : () => import('./Modules/Auth/auth.module').then( m=> m.AuthModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
