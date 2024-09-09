import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, forkJoin, map, of, switchMap, tap } from 'rxjs';
import {
  Beneficiario,
  Beneficio,
  Catalogo,
  Cupon,
  Poliza,
  Precio,
  Servicio,
  Venta,
} from 'src/app/Modules/Core/models';
import { Descuento } from 'src/app/Modules/Core/models/Descuento.model';
import {
  BeneficiariosService,
  BeneficiosService,
  CatalogosService,
  CuponesService,
  ExtrasService,
  PlanesService,
  PolizasService,
  PreciosService,
  ServiciosService,
  VentasService,
} from 'src/app/Modules/Core/services';
import { NotificationService } from 'src/app/Modules/shared/Components/notification/notification.service';
import { MapToServicioUi } from 'src/app/Modules/shared/utils/mappers/servicio.mappers';
import {
  Size,
  PositionMessage,
} from 'src/app/Modules/shared/Components/notification/enums';
import { ServByPlan } from 'src/app/Modules/Landing-page/Components/multi-step/multi-step.component';
import { ServicioUi } from '../../models/Servicio.ui';
import { Extra } from 'src/app/Modules/Core/models/Extra.model';
import { HttpClient } from '@angular/common/http';


declare var gtag : any;

@Component({
  selector: 'app-confirm-payment',
  styleUrls: ['./confirm-payment.component.css'],
  templateUrl: './confirm-payment.component.html',
})
export class ConfirmPaymentComponent implements OnInit {

  trackEvent(eventName: string, eventDetails: string, eventCategory: string) {
    gtag('event', eventName, {
    // event Type - example: 'SCROLL_TO_TOP_CLICKED'
    'event_category': eventCategory,
    // the label that will show up in the dashboard as the events name
    'event_label': eventName,
    // a short description of what happened
    'value': eventDetails
    })
  }



  ngOnInit(): void {

    
    


    console.log(this.route.snapshot.queryParams);

    this.onLoadProcess = new Subject();

    this.observerProcess = this.onLoadProcess.asObservable();

    this.onLoading(this.observerProcess);

    const { result, _, __, order_id, payment_intent_client_secret    } = this.route.snapshot.queryParams;

    console.log(this.route.snapshot.queryParams);



    console.log(result);
    const results = (result as string).split('-');

    const ventas = results[0].split(',');
    const polizas = results[1].split(',');

    console.log({ ventas, polizas });

    const requests: any = polizas.map((poliza) =>
      this.polizasService.getOne(poliza)
    );

    forkJoin(requests)
      .pipe(
        map((resp: any) => {
          this.polizas = resp.flat();

          this.polizas.forEach((polItem) => {
            polItem.status = 2;
          });
        }),
        tap((resp: any) => {
          return forkJoin(
            this.polizas.map((pol) =>
              this.polizasService.update(pol.poliza_id ?? pol.id!, {
                fecha_salida : pol.fecha_salida.split('T')[0],
                fecha_retorno : pol.fecha_retorno.split('T')[0],
                status: 2,
                observaciones : 'Pagos',
                username : 'WEBREDCARD',
                fecha_caducidad : pol.fecha_caducidad.split('T')[0],
              })
            )
          ).subscribe({});
        }),
        switchMap((resp: any) => {
          return forkJoin(
            this.polizas.map((polItem) =>
              this.ventaService.update(polItem.venta_id, {
                status: 2,
                order_id : order_id ?? payment_intent_client_secret,
              })
            )
          ).pipe(
            map((resp) => {
              return this.polizas;
            })
          );
        }),
        switchMap((resp) => {
          const requests: any[] = this.polizas.map((poliza) =>
            this.ventaService.getOne(poliza.venta_id).pipe(
              map((resp: any) => {
                this.ventas = resp.flat();
                this.venta = this.ventas[0];
                return this.polizas;
              })
            )
          );

          return forkJoin(requests);
        }),
        switchMap((resp: any[]) => {
          const requests: any[] = this.polizas.map((poliza) =>
            this.beneficiarioService.getOne(poliza.poliza_id ?? poliza.id!)
          );
          return forkJoin(requests);
        }),
        switchMap((resp: any[]) => {
          this.listBeneficiarios = resp.flat().flat();
          console.log(this.listBeneficiarios);
          return this.servicioService.getOne(this.polizas[0].servicio_id);
        }),
        switchMap((resp: Servicio[]) => {
          this.servicio = resp[0];
          return this.planesService.getOne(this.servicio!.servicio_id).pipe(
            map((planesData) => {
              return { servicio: this.servicio, planes: planesData };
            })
          );
        }),
        switchMap((resp: any) => {
          this.planes = resp;
          return this.cuponesService.getAll();
        }),
        switchMap((resp: Cupon[]) => {
          console.log({ resp });
          this.cupones = resp;
          return this.catalogosService.getAll();
        }),

        switchMap((resp: Catalogo[]) => {
          console.log({ resp });
          this.catalogos = resp;
          return this.catalogosService.getAll();
        }),
        switchMap((data) => {
          this.multiviajes = data;
          return this.extrasService.getAll();
        }),
        switchMap((resp: Extra[]) => {
          this.extras = resp;
          return this.beneficiosService.getAll();
        }),
        switchMap((resp: Beneficio[]) => {
          this.beneficios = resp;
          return this.preciosService.getAll();
        })
      )
      .subscribe({
        next: (data) => {
          this.precios = data as Precio[];

          this.servicioUi = MapToServicioUi(
            this.catalogos,
            this.beneficios,
            this.extras,
            this.planes!,
            this.precios,
            this.cupones,
            this.multiviajes
          );

          this.servicioUi.precioSelected =
            this.venta!.total_pago / parseInt(this.venta!.cantidad);

          console.log('))))))))');
          console.log(this.servicioUi);
          console.log(this.polizas);
          console.log(this.venta);
          console.log(this.listBeneficiarios);
          console.log('))))))))');

          this.onLoadProcess?.complete();
        },
        error: (err) => {
          this.onLoadProcess?.complete();
          this.onError(err);
        },
      });
  }

  private route = inject(ActivatedRoute);
  private ventaService = inject(VentasService);
  private notificacionesModalService = inject(NotificationService);
  private polizasService = inject(PolizasService);
  private servicioService = inject(ServiciosService);
  private extrasService = inject(ExtrasService);
  private planesService = inject(PlanesService);
  private beneficiarioService = inject(BeneficiariosService);
  private cuponesService = inject(CuponesService);
  private preciosService = inject(PreciosService);
  private catalogosService = inject(CatalogosService);
  private beneficiosService = inject(BeneficiosService);

  venta_id: string | null = null;
  listBeneficiarios: Beneficiario[] = [];
  venta: Venta | null = null;
  ventas: Venta[] = [];
  poliza: Poliza | null = null;
  servicio: Servicio | null = null;
  planes: ServByPlan | null = null;
  cupones: Cupon[] = [];
  catalogos: Catalogo[] = [];
  multiviajes: Catalogo[] = [];
  precios: Precio[] = [];
  descuentos: Descuento[] = [];
  extras: Extra[] = [];
  beneficios: Beneficio[] = [];
  servicioUi: ServicioUi | null = null;
  polizas: Poliza[] = [];

  onLoadProcess?: Subject<any>;
  observerProcess?: Observable<any>;

  openCardBeneficiario: boolean = false;

  onSuccess(message: string) {
    this.notificacionesModalService.show(message, {
      size: Size.normal,
      duration: 3000,
      positions: [PositionMessage.center],
      imageUrl: 'assets/icons/check.svg',
      closeOnTouch: true,
    });
  }

  onError(message: string) {
    this.notificacionesModalService.show(message, {
      size: Size.normal,
      duration: 3000,
      positions: [PositionMessage.center],
      imageUrl: 'assets/icons/warning.svg',
      closeOnTouch: true,
    });
  }

  onLoading(observerProcess: Observable<any>) {
    this.notificacionesModalService.show('Cargando', {
      size: Size.normal,
      positions: [PositionMessage.center],
      imageUrl: 'assets/icons/loading.svg',
      closeOnTouch: false,
      notifier: observerProcess,
    });
  }

  private http = inject(HttpClient);

  downloadPdf() {
    const pdfUrl = `/assets/pdf/CONDICIONADOREDCARD.pdf`;

    // Use HttpClient to fetch the PDF file as a Blob
    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);

      // Create a link element and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `CONDICIONADOREDCARD.pdf`;
      document.body.appendChild(a);
      a.click();

      // Clean up resources
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }
}
