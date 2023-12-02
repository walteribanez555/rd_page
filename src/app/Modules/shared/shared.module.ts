import { NgModule, Pipe } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { SelectCustomComponent } from './Components/selectCustom/selectCustom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomCalendarComponent } from './Components/custom-calendar/custom-calendar.component';
import { TagComponent } from './Components/tag/tag.component';
import { NotificationComponent } from './Components/notification/notification.component';
import { MessageNotificationComponent } from './Components/notification/messageNotification/messageNotification.component';


@NgModule({
  declarations: [
    NavbarComponent,
    SelectCustomComponent,
    CustomCalendarComponent,
    TagComponent,
    NotificationComponent,
    MessageNotificationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    SlicePipe,
  ],
  providers: [

  ],
  exports : [
    NavbarComponent,
    SelectCustomComponent,
    CustomCalendarComponent,
    TagComponent,
    NotificationComponent,
    MessageNotificationComponent,
  ]

})
export class SharedModule { }
