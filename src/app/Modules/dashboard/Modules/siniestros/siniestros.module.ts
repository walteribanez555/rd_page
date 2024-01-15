import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/Modules/shared/shared.module';
import { SiniestrosRoutingModule } from './siniestros-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { RouterModule } from '@angular/router';
import { AuthModule } from 'src/app/Modules/Auth/auth.module';
import { CoreModule } from 'src/app/Modules/Core/core.module';
import { ListComponent } from './pages/list/list.component';
import { CreateComponent } from './pages/create/create.component';
import { InputTypeSiniestroComponent } from './components/inputTypeSiniestro/inputTypeSiniestro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImagesService } from './services/images.service';
import { SiniestroComponent } from './pages/siniestro/siniestro.component';
import { SiniestroDetailsComponent } from './components/siniestro-details/siniestro-details.component';
import { ChatComponent } from './components/chat/chat.component';
import { MessageComponent } from './components/message/message.component';
import { ScrollToBottomDirective } from './directives/ScrollToBottomDirective.directive';

@NgModule({
  declarations: [
    LayoutPageComponent,
    ListComponent,
    CreateComponent,
    SiniestroComponent,
    InputTypeSiniestroComponent,
    SiniestroDetailsComponent,
    ChatComponent,
    MessageComponent,
    ScrollToBottomDirective,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SiniestrosRoutingModule,
    RouterModule,
    AuthModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,

  ],
  providers : [
    ImagesService,
  ]
})
export class SiniestrosModule {}
