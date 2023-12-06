import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/Modules/shared/shared.module';
import { RouterModule } from '@angular/router';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';

@NgModule({
  declarations: [LayoutPageComponent],
  imports: [CommonModule, SharedModule, RouterModule, UsuariosRoutingModule],
})
export class UsuariosModule {}
