import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LayoutPageComponent } from './Pages/layout-page/layout-page.component';
import { MultiStepComponent } from './Components/multi-step/multi-step.component';
import { DestinyComponent } from './Components/destiny/destiny.component';
import { DatesToTravelComponent } from './Components/datesToTravel/datesToTravel.component';
import { AgesTravelerComponent } from './Components/agesTraveler/agesTraveler.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { DatosPolizasComponent } from './Components/datosPolizas/datosPolizas.component';
import { PlanesComponent } from './Components/planes/planes.component';
import { PlanComponent } from './Components/plan/plan.component';
import { ModalPlanDetailsComponent } from './Components/modal-plan-details/modal-plan-details.component';
import { ModalService } from './Components/modal-plan-details/services/modal-service';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../Core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExtraPolizaComponent } from './Components/extraPoliza/extra-poliza.component';
import { ExtraComponent } from './Components/extra/extra.component';
import { DetailComponent } from './Components/detail/detail.component';
import { PolizaComponent } from './Components/poliza/poliza.component';
import { PolizasModule } from '../dashboard/Modules/polizas/polizas.module';
import { MultiviajeComponent } from './Components/multiviaje/multiviaje.component';
import { ExtraDetailComponent } from './Components/extra/extra-detail/extraDetail.component';
import { ExtraDetailService } from './Components/extra/extra-detail/extraDetail.service';
import { SharedModule } from '../shared/shared.module';
import { ListCoberturaComponent } from './Components/list-cobertura/list-cobertura.component';
import { CoberturaComponent } from './Components/cobertura/cobertura.component';
import { PaymentStripeComponent } from './Components/payment/paymentStripe/paymentStripe.component';

@NgModule({
  declarations: [
    LayoutPageComponent,
    MultiStepComponent,
    DestinyComponent,
    DatesToTravelComponent,
    AgesTravelerComponent,
    PaymentComponent,
    DatosPolizasComponent,
    PlanesComponent,
    PlanComponent,
    ModalPlanDetailsComponent,
    ExtraPolizaComponent,
    ExtraComponent,
    DetailComponent,
    PolizaComponent,
    MultiviajeComponent,
    ExtraDetailComponent,
    ListCoberturaComponent,
    CoberturaComponent,
    PaymentStripeComponent,
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    // SharedModule,
    SharedModule,
    RouterModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [ModalService,ExtraDetailService],
  exports: [],
})
export class LandingPageModule {}
