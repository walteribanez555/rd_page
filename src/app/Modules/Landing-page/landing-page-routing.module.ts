import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './Pages/layout-page/layout-page.component';
import { HomeComponent } from './Pages/home/home.component';
import { ConfirmPaymentComponent } from './Pages/confirm-payment/confirm-payment.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path : 'confirm-payment',
        component : ConfirmPaymentComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
