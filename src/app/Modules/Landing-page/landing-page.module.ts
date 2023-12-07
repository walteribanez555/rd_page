import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LayoutPageComponent } from './Pages/layout-page/layout-page.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './Pages/home/home.component';
import { MultiStepComponent } from './Components/multi-step/multi-step.component';
import { DestinyComponent } from './Components/destiny/destiny.component';
import { DatesToTravelComponent } from './Components/datesToTravel/datesToTravel.component';
import { AgesTravelerComponent } from './Components/agesTraveler/agesTraveler.component';
import { LocationComponent } from './Components/location/location.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { DatosPolizasComponent } from './Components/datosPolizas/datosPolizas.component';
import { PlanesComponent } from './Components/planes/planes.component';
import { PlanComponent } from './Components/plan/plan.component';
import { ModalPlanDetailsComponent } from './Components/modal-plan-details/modal-plan-details.component';
import { ModalService } from './Components/modal-plan-details/services/modal-service';
import { ListCoberturaComponent } from './Components/list-cobertura/list-cobertura.component';
import { CoberturaComponent } from './Components/cobertura/cobertura.component';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../Core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExtraPolizaComponent } from './Components/extraPoliza/extra-poliza.component';

@NgModule({
  declarations: [
    LayoutPageComponent,
    HomeComponent,
    MultiStepComponent,
    DestinyComponent,
    DatesToTravelComponent,
    AgesTravelerComponent,
    LocationComponent,
    PaymentComponent,
    DatosPolizasComponent,
    PlanesComponent,
    PlanComponent,
    ModalPlanDetailsComponent,
    ListCoberturaComponent,
    CoberturaComponent,
    ExtraPolizaComponent,
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
  providers: [ModalService],
  exports: [],
})
export class LandingPageModule {}
