import { NgModule } from "@angular/core";
import { CotizacionComponent } from "./cotizacion.component";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { CardAgeComponent } from "./components/card-age/card-age.component";
import { CotizacionRoutingModule } from "./cotizacion-routing.module";
import { BackButtonComponent } from "../shared/Components/back-button/back-button.component";

@NgModule({
  declarations: [
    CotizacionComponent,
    CardAgeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    CotizacionRoutingModule,
    BackButtonComponent
],
  providers : [

  ]
})
export class CotizacionModule { }
