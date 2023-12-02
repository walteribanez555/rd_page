import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/Modules/shared/shared.module";
import { ComunicacionRoutingModule } from "./comunicacion-routing.module";
import { LayoutPageComponent } from "./pages/layout-page/layout-page.component";
import { RouterModule } from "@angular/router";





@NgModule({
  declarations: [
    LayoutPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ComunicacionRoutingModule,
    RouterModule,
  ]
})
export class ComunicacionModule { }
