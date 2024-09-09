import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, catchError, forkJoin, map, switchMap, tap, throwError } from 'rxjs';
import { Venta, Servicio, Cupon, Catalogo,  Beneficiario, Beneficio, Poliza, Precio } from 'src/app/Modules/Core/models';
import { Descuento } from 'src/app/Modules/Core/models/Descuento.model';
import { Extra } from 'src/app/Modules/Core/models/Extra.model';
import { VentasService, PolizasService, ServiciosService, ExtrasService, PlanesService, BeneficiariosService, CuponesService, PreciosService, CatalogosService, BeneficiosService } from 'src/app/Modules/Core/services';
import { ServByPlan } from 'src/app/Modules/Landing-page/Components/multi-step/multi-step.component';
import { Size, PositionMessage } from 'src/app/Modules/shared/Components/notification/enums';
import { NotificationService } from 'src/app/Modules/shared/Components/notification/notification.service';
import { ServicioUi } from 'src/app/Modules/shared/models/Servicio.ui';
import { MapToServicioUi } from 'src/app/Modules/shared/utils/mappers/servicio.mappers';

@Component({
  selector: 'polizas',
  styleUrls: ['./polizas.component.css'],
  templateUrl : './polizas.component.html',
})
export class PolizasComponent implements OnInit {
  private notificationModalService = inject(NotificationService);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private ventaService = inject(VentasService);
  private polizasService = inject(PolizasService);
  private servicioService = inject(ServiciosService);
  private extrasService = inject(ExtrasService);
  private planesService = inject(PlanesService);
  private beneficiarioService = inject(BeneficiariosService);
  private cuponesService = inject(CuponesService);
  private preciosService = inject(PreciosService);
  private catalogosService = inject(CatalogosService);
  private beneficiosService = inject(BeneficiosService);

  constructor( ){



  }


  beneficiario_id : number |null = null;
  poliza_id : number | null = null;
  venta_id : number | null = null;

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
  multiviajes : Catalogo[] = [];


  onLoadProcess?: Subject<any>;
  observerProcess?: Observable<any>;

  isReady = false;

  isClient = true;

  ngOnInit(): void {
    this.onLoadProcess = new Subject();

    this.observerProcess = this.onLoadProcess.asObservable();

    this.onLoading(this.observerProcess);

    this.activatedRoute.params.pipe(
      switchMap(
        (params : any) => {
          this.venta_id = params.id
          return this.activatedRoute.queryParams;
        }
      ),
      switchMap( (queryParams : any) => {
        this.beneficiario_id = queryParams.beneficiario_id;
        this.poliza_id = queryParams.poliza_id;
        return this.ventaService.getOne(this.venta_id!);
      }),
      switchMap((resp : Venta[]) => {
        this.venta = resp[0];
        return this.polizasService.getOne(this.poliza_id!);
      }),
      switchMap((resp: Poliza[]) => {
        this.poliza = resp[0];
        return this.beneficiarioService.getOne(this.poliza_id!);
      }),
      switchMap((resp : Beneficiario[]) => {
        this.listBeneficiarios= resp;
        return this.servicioService.getOne(this.poliza!.servicio_id);
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
        this.cupones = resp;
        return this.catalogosService.getAll();
      }),
      switchMap((resp : Catalogo[])=> {
        this.catalogos = resp;
        return this.catalogosService.getAllExtras();
      }),
      switchMap((resp: Catalogo[]) => {
        this.multiviajes = resp;
        return this.extrasService.getAll();
      }),
      switchMap((resp: Extra[]) => {
        this.extras = resp;
        return this.beneficiosService.getAll();
      }),
      catchError((error) => {
        console.error('Error in switchMap chain:', error);
        return throwError(error); // Rethrow the error to propagate it to the outer subscription
      })
    ).subscribe({
      next: (resp: any) => {
        this.beneficios = resp;

        this.servicioUi = MapToServicioUi(
          this.catalogos,
          this.beneficios,
          this.extras,
          this.planes!,
          this.precios,
          this.cupones,
          this.multiviajes
        );

        console.log({servicio : this.servicioUi});

        this.servicioUi.precioSelected =
          this.venta!.total_pago / parseInt(this.venta!.cantidad);

        this.onLoadProcess?.complete();
        this.isReady = true;
      },
      error: (err) => {
        this.onLoadProcess?.complete();
        this.onError(err);
      },
    });
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

  private http = inject(HttpClient);


  downloadPdf() {
    const pdfUrl = `/assets/pdf/CONDICIONADOREDCARD.pdf`;

    window.open(`https://cotizaredcard.online/assets/pdf/CONDICIONADOREDCARD.pdf`)

    // Use HttpClient to fetch the PDF file as a Blob
    // this.http.get(pdfUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
    //   const url = window.URL.createObjectURL(blob);

    //   // Create a link element and trigger the download
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = `CONDICIONADOREDCARD.pdf`;
    //   document.body.appendChild(a);
    //   a.click();

    //   // Clean up resources
    //   document.body.removeChild(a);
    //   window.URL.revokeObjectURL(url);
    // });
  }

}
