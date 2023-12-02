import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutPageComponent } from "./pages/layout-page/layout-page.component";
import { ListComponent } from "./pages/list/list.component";
import { PolizasComponent } from "./pages/polizas/polizas.component";
import { PolizaComponent } from "./pages/poliza/poliza.component";

const routes: Routes = [
  {
    path : '',
    component : LayoutPageComponent,
    children : [
      {
        path : 'list',
        component : ListComponent,
      },
      {
        path : 'list/:id',
        component : PolizasComponent,
      },

      {
        path: 'list/:id/doc/:po',
        component : PolizaComponent,
      }






    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolizasRoutingModule { }
