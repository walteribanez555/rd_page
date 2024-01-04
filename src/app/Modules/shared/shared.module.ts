import { NgModule, Pipe } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
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
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    SlicePipe,
    RouterModule,

  ],
  providers: [NotificationService],
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
    ListCoberturaComponent
  ],
})
export class SharedModule {}
