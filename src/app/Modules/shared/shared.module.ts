import { NgModule, Pipe } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { SelectCustomComponent } from './Components/selectCustom/selectCustom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomCalendarComponent } from './Components/custom-calendar/custom-calendar.component';
import { TagComponent } from './Components/tag/tag.component';
import { NotificationComponent } from './Components/notification/notification.component';
import { NotificationService } from './Components/notification/notification.service';
import { SwitchBtnComponent } from './Components/switch_btn/switch_btn.component';
import { GenderInputComponent } from './Components/gender-input/gender-input.component';
import { InputDateComponent } from './Components/input-date/input-date.component';
import { InputTelfComponent } from './Components/input-telf/input-telf.component';
import { MenuHamburguerComponent } from './Components/menuHamburguer/menuHamburguer.component';
import { RouterModule } from '@angular/router';
import { CoberturaComponent } from './Components/cobertura/cobertura.component';
import { ListCoberturaComponent } from './Components/list-cobertura/list-cobertura.component';
import { ConfirmPaymentComponent } from './pages/confirm-payment/confirm-payment.component';
import { PolizasModule } from '../dashboard/Modules/polizas/polizas.module';
import { CardBeneficiarioComponent } from './Components/card-beneficiario/card-beneficiario.component';
import { CardPolizaComponent } from './Components/card-poliza/card-poliza.component';
import { PolizaPdfComponent } from './Components/pdf/poliza-pdf/poliza-pdf.component';
import { ModalBenService } from './Components/modals/modal-beneficiario/service/modal.service';
import { GeneratePdfService } from './Components/pdf/poliza-pdf/services/generate-pdf.service';
import { QRCodeModule } from 'angularx-qrcode';
import { ModalBeneficiarioComponent } from './Components/modals/modal-beneficiario/modal-beneficiario.component';
import { CoreModule } from '../Core/core.module';

@NgModule({
  declarations: [
    NavbarComponent,
    SelectCustomComponent,
    CustomCalendarComponent,
    TagComponent,
    NotificationComponent,
    SwitchBtnComponent,
    GenderInputComponent,
    InputDateComponent,
    InputTelfComponent,
    MenuHamburguerComponent,
    CoberturaComponent,
    ListCoberturaComponent,
    ConfirmPaymentComponent,
    CardBeneficiarioComponent,
    CardPolizaComponent,
    PolizaPdfComponent,
    ModalBeneficiarioComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    SlicePipe,
    RouterModule,
    CurrencyPipe,
    QRCodeModule,
    CoreModule,
  ],
  providers: [NotificationService, ModalBenService, GeneratePdfService],
  exports: [
    NavbarComponent,
    SelectCustomComponent,
    CustomCalendarComponent,
    TagComponent,
    NotificationComponent,
    SwitchBtnComponent,
    GenderInputComponent,
    InputDateComponent,
    InputTelfComponent,
    MenuHamburguerComponent,
    CoberturaComponent,
    ListCoberturaComponent,
    CardBeneficiarioComponent,
    CardPolizaComponent,
    PolizaPdfComponent,
    ModalBeneficiarioComponent,
  ],
})
export class SharedModule {}
