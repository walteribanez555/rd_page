import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SharedModule } from 'src/app/Modules/shared/shared.module';
import { PolizasRoutingModule } from './polizas-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { RouterModule } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { PolizasComponent } from './pages/polizas/polizas.component';
import { UserService } from 'src/app/Modules/Auth/Services/user.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    LayoutPageComponent,
    ListComponent,
    PolizasComponent,


  ],
  imports: [
    CommonModule,
    SharedModule,
    PolizasRoutingModule,
    RouterModule,
    HttpClientModule,


  ],
  exports: [
  ],
  providers: [
    UserService
  ],
})
export class PolizasModule {}
