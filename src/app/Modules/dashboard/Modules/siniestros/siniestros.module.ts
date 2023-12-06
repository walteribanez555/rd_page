import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/Modules/shared/shared.module';
import { SiniestrosRoutingModule } from './siniestros-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LayoutPageComponent],
  imports: [CommonModule, SharedModule, SiniestrosRoutingModule, RouterModule],
})
export class SiniestrosModule {}
