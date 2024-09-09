import { RouterModule, Routes } from "@angular/router";
import { CotizacionComponent } from "./cotizacion.component";
import { NgModule } from "@angular/core";



const routes : Routes = [
  {
    path : '',
    component : CotizacionComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionRoutingModule { }
