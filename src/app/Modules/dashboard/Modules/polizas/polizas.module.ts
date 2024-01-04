import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SharedModule } from 'src/app/Modules/shared/shared.module';
import { PolizasRoutingModule } from './polizas-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { RouterModule } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { PolizasComponent } from './pages/polizas/polizas.component';
import { PolizaComponent } from './pages/poliza/poliza.component';
import { UserService } from 'src/app/Modules/Auth/Services/user.service';

@NgModule({
  declarations: [
    LayoutPageComponent,
    ListComponent,
    PolizasComponent,
    PolizaComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    PolizasRoutingModule,
    RouterModule,


  ],
  exports: [
  ],
  providers: [
    UserService
  ],
})
export class PolizasModule {}
