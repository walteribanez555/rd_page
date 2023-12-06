import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SharedModule } from 'src/app/Modules/shared/shared.module';
import { PolizasRoutingModule } from './polizas-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { RouterModule } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { CardPolizaComponent } from './components/card-poliza/card-poliza.component';
import { PolizasComponent } from './pages/polizas/polizas.component';
import { PolizaComponent } from './pages/poliza/poliza.component';
import { CardBeneficiarioComponent } from './components/card-beneficiario/card-beneficiario.component';
import { ModalBenService } from './components/modals/modal-beneficiario/service/modal.service';
import { QRCodeModule } from 'angularx-qrcode';
import { PolizaPdfComponent } from './components/pdf/poliza-pdf/poliza-pdf.component';
import { ModalBeneficiarioComponent } from './components/modals/modal-beneficiario/modal-beneficiario.component';
import { GeneratePdfService } from './components/pdf/poliza-pdf/services/generate-pdf.service';

@NgModule({
  declarations: [
    LayoutPageComponent,
    ListComponent,
    CardPolizaComponent,
    PolizasComponent,
    PolizaComponent,
    CardBeneficiarioComponent,
    PolizaPdfComponent,
    ModalBeneficiarioComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PolizasRoutingModule,
    RouterModule,
    CurrencyPipe,
    QRCodeModule,
  ],
  providers: [ModalBenService, GeneratePdfService],
})
export class PolizasModule {}
