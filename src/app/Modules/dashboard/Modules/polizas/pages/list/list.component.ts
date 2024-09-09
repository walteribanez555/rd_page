import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  inject,
} from '@angular/core';
import { Observable, Subject, switchMap } from 'rxjs';
import { UserService } from 'src/app/Modules/Auth/Services/user.service';
import { User } from 'src/app/Modules/Auth/models/User';
import { Servicio, Venta } from 'src/app/Modules/Core/models';
import { Reporte } from 'src/app/Modules/Core/models/Reporte.model';
import { ServiciosService, VentasService } from 'src/app/Modules/Core/services';
import { ReportesService } from 'src/app/Modules/Core/services/reportes.service';
import {
  Size,
  PositionMessage,
} from 'src/app/Modules/shared/Components/notification/enums';
import { NotificationService } from 'src/app/Modules/shared/Components/notification/notification.service';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {}

  private notificationModalService = inject(NotificationService);
  private serviciosService = inject(ServiciosService);
  private reportesService = inject(ReportesService);

  ventas: Reporte[] = [];

  ngOnInit(): void {
    const client_id = localStorage.getItem('client_id');

    const process = new Subject();
    const observerProcess = process.asObservable();

    this.onLoading(observerProcess);

    this.serviciosService
      .getAll()
      .pipe(
        switchMap((servicios) => {
          this.servicios = servicios;
          return this.reportesService.getByClientId(client_id!);
        })
      ).subscribe({
        next: (resp) => {
          this.ventas = resp;
          process.complete();
        },
        error: (err) => {
          this.onError(err);
          process.complete();
        },
        complete: () => {
          process.complete();
        },
      });

    // this.onError("No implementado correctamente");
  }
  // private renderer: Renderer2, private elementRef: ElementRef

  screenWidth?: number;
  servicios: Servicio[] = [];

  mapQuantity(quantity: string) {
    return quantity
      .split(',')
      .reduce((prev, actual) => prev + parseInt(actual), 0);
  }

  mapService( servicio_id  : number){



    return this.servicios.filter( serv => serv.servicio_id === servicio_id)[0].servicio;
  }

  getTotalPayment( total: string, quantity ="1" ) {
    const count = quantity
      .split(',')
      .reduce((prev, actual) => prev + parseInt(actual), 0);

    const price = total
      .split(',')
      .reduce((prev, actual) => prev + parseInt(actual), 0 );

    return price/count;
  }

  getAmountByQuantity( amount : number , quantity = "1"){
    const count = quantity
      .split(',')
      .reduce((prev, actual) => prev + parseInt(actual), 0);

    return amount/count;

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

  getStatusClass(status: number) {
    return {
      success: status === 2,
      deleted: status === 3,
    };
  }
}
