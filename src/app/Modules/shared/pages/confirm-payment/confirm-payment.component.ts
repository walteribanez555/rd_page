import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, forkJoin, map, of, switchMap } from 'rxjs';
import {
  Beneficiario,
  Beneficio,
  Catalogo,
  Cupon,
  Extra,
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
  DescuentosService,
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
import { ServicioUi } from 'src/app/Modules/shared/models';
import { ServByPlan } from 'src/app/Modules/Landing-page/Components/multi-step/multi-step.component';

@Component({
  selector: 'app-confirm-payment',
  styleUrls: ['./confirm-payment.component.css'],
  templateUrl: './confirm-payment.component.html',
})
export class ConfirmPaymentComponent implements OnInit {
  ngOnInit(): void {
    console.log(this.route.snapshot.queryParams);

    this.onLoadProcess = new Subject();

    this.observerProcess = this.onLoadProcess.asObservable();

    this.onLoading(this.observerProcess);

    const { result, _, __, order_id } = this.route.snapshot.queryParams;

    console.log(result);
    const results = (result as string).split('-');

    this.ventaService
      .update(results[0], {
        status: 2,
        order_id,
      })
      .pipe(
        switchMap((resp) => {
          this.venta_id = results.shift()!;
          return this.ventaService.getOne(this.venta_id);

        }),
        switchMap((resp : Venta[]) => {
          this.venta = resp[0];
          const requests = results[0]
            .split(',')
            .map((result) => this.polizasService.getOne(result));
          return forkJoin(requests);
        }),
        switchMap((resp: any[]) => {
          this.polizas = resp.flat();
          const requests: any[] = this.polizas.map((poliza) =>
             this.beneficiarioService.getOne(poliza.poliza_id??poliza.id!)
          );
          return forkJoin(requests);
        }),
        switchMap((resp : any[]) => {
          this.listBeneficiarios= resp.flat();
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
          console.log({resp});
          this.planes = resp;
          return this.cuponesService.getAll();
        }),
        switchMap((resp: Cupon[]) => {
          console.log({resp});
          this.cupones = resp;
          return this.catalogosService.getAll();
        }),
        switchMap((resp: Catalogo[]) => {
          console.log({resp});
          this.catalogos = resp;
          return this.extrasService.getAll();
        }),
        switchMap((resp: Extra[]) => {
          console.log({resp});
          this.extras = resp;
          return this.beneficiosService.getAll();
        }),
        switchMap((resp: Beneficio[]) => {
          console.log({resp});
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
            this.cupones
          );

          this.servicioUi.precioSelected =
            this.venta!.total_pago / parseInt(this.venta!.cantidad);

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
  poliza: Poliza | null = null;
  servicio: Servicio | null = null;
  planes: ServByPlan | null = null;
  cupones: Cupon[] = [];
  catalogos: Catalogo[] = [];
  precios: Precio[] = [];
  descuentos: Descuento[] = [];
  extras: Extra[] = [];
  beneficios: Beneficio[] = [];
  servicioUi: ServicioUi | null = null;
  polizas: Poliza[]  = [];

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
}
