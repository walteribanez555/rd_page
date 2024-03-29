import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutPageComponent } from './Pages/layout-page/layout-page.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../Core/core.module';
import { LandingPageModule } from '../Landing-page/landing-page.module';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';

@NgModule({
  declarations: [LayoutPageComponent, NavbarComponent, UserProfileComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    RouterModule,
    CoreModule,
    LandingPageModule,
  ],
})
export class DashboardModule {}
