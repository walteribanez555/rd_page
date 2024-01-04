import { Component, inject } from '@angular/core';
import {  Location } from '@angular/common';
import { Observable } from 'rxjs';
import { Size, PositionMessage } from 'src/app/Modules/shared/Components/notification/enums';
import { NotificationService } from 'src/app/Modules/shared/Components/notification/notification.service';

@Component({
  selector: 'poliza',
  styleUrls: ['./poliza.component.css'],
  templateUrl: './poliza.component.html',
})
export class PolizaComponent {

  private notificationModalService = inject(NotificationService);
  private location = inject(Location);

  constructor( ){

  }
  ngOnInit(): void {
    this.onError("No implementado correctamente aun");
  }

  onBackBtn( ) {
    this.location.back();
  }

  onSuccess(message: string) {
    this.notificationModalService.show(message, {
      size: Size.normal,
      duration: 3000,
      positions: [PositionMessage.center],
      imageUrl: 'assets/icons/check.svg',
      closeOnTouch: true,
    });
  }

  onError(message: string) {
    this.notificationModalService.show(message, {
      size: Size.normal,
      duration: 3000,
      positions: [PositionMessage.center],
      imageUrl: 'assets/icons/warning.svg',
      closeOnTouch: true,
    });
  }

  onLoading(observerProcess: Observable<any>) {
    this.notificationModalService.show('Cargando', {
      size: Size.normal,
      positions: [PositionMessage.center],
      imageUrl: 'assets/icons/loading.svg',
      closeOnTouch: false,
      notifier: observerProcess,
    });
  }


}
