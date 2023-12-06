import { NgModule, Pipe } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { SelectCustomComponent } from './Components/selectCustom/selectCustom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomCalendarComponent } from './Components/custom-calendar/custom-calendar.component';
import { TagComponent } from './Components/tag/tag.component';
import { NotificationComponent } from './Components/notification/notification.component';
import { NotificationService } from './Components/notification/notification.service';

@NgModule({
  declarations: [
    NavbarComponent,
    SelectCustomComponent,
    CustomCalendarComponent,
    TagComponent,
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    SlicePipe,
  ],
  providers: [NotificationService],
  exports: [
    NavbarComponent,
    SelectCustomComponent,
    CustomCalendarComponent,
    TagComponent,
    NotificationComponent,
  ],
})
export class SharedModule {}
