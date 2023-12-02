import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './Pages/layout-page/layout-page.component';

const routes: Routes = [
  {
    path : '',
    component : LayoutPageComponent,
    children : [
      {
        path : 'messages',
        loadChildren : () => import('./Modules/comunicacion/comunicacion.module').then( m => m.ComunicacionModule)
      },
      {
        path : 'policies',
        loadChildren : () => import('./Modules/polizas/polizas.module').then(m=> m.PolizasModule)
      },
      {
        path : 'accidents',
        loadChildren : () => import('./Modules/siniestros/siniestros.module').then(m => m.SiniestrosModule)
      },
      {
        path: 'usuarios',
        loadChildren : () => import('./Modules/usuarios/usuarios.module').then(m => m.UsuariosModule)
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
