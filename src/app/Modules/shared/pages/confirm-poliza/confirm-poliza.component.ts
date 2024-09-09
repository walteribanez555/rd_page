import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin, switchMap, map, Observable } from 'rxjs';
import { Size, PositionMessage } from '../../Components/notification/enums';
import { NotificationService } from '../../Components/notification/notification.service';
import { ServicioUi } from '../../models/Servicio.ui';
import { Cupon } from '../../models/data/Cupon';
import { MapToServicioUi } from '../../utils/mappers/servicio.mappers';
import { HttpClient } from '@angular/common/http';
import { Servicio, Catalogo, Beneficio, Precio, Poliza, Beneficiario, Venta } from 'src/app/Modules/Core/models';
import { Descuento } from 'src/app/Modules/Core/models/Descuento.model';
import { Extra } from 'src/app/Modules/Core/models/Extra.model';
import { ServByPlan } from 'src/app/Modules/Landing-page/Components/multi-step/multi-step.component';
import { VentasService, PolizasService, ServiciosService, ExtrasService, PlanesService, BeneficiariosService, CuponesService, PreciosService, CatalogosService, BeneficiosService } from 'src/app/Modules/Core/services';

@Component({
  selector: 'app-confirm-poliza',
  templateUrl: './confirm-poliza.component.html',
  styleUrls: ['./confirm-poliza.component.css'],
})
export class ConfirmPolizaComponent implements OnInit {
  ngOnInit(): void {
    const data = this.activeParams.snapshot.queryParams['polizas']

    const polizas_id : string[]   = data.split(',');
    const requests : any[] = [];



    const process = new Subject();
    const observerProcess = process.asObservable();
    this.onLoading(observerProcess);


    polizas_id.forEach(poliza =>
        requests.push(this.polizasService.getOne(poliza))
      )

    forkJoin(requests).pipe(
      switchMap( resp => {
        this.polizas = resp.flat();
        const requests = this.polizas.map( poliza => this.ventaService.getOne(poliza.venta_id));
        return forkJoin(requests);
      } ),
      switchMap( resp => {
        this.ventas = resp.flat();
        const requests = polizas_id.map( poliza => this.beneficiarioService.getOne(poliza))
        return forkJoin(requests);
      }),
      switchMap( resp => {
        this.beneficiarios = resp.flat();
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
      switchMap((resp: Beneficio[]) => {
        this.beneficios = resp;
        return this.preciosService.getAll();
      })
    ).subscribe({
      next: ( data ) => {
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
          this.ventas[0]!.total_pago / parseInt(this.ventas[0]!.cantidad);

        // console.log('))))))))');
        // console.log(this.servicioUi);
        // console.log(this.polizas);
        // console.log(this.ventas);
        // console.log(this.beneficiarios);
        // console.log('))))))))');
          process.complete();

      },
      error : ( err ) => {
        process.complete();
        console.log({err});
      }
    })

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

  polizas : Poliza[] = [];
  beneficiarios : Beneficiario[] = [];
  ventas : Venta[] = [];
  servicio: Servicio | null = null;
  planes: ServByPlan | null = null;
  cupones: Cupon[] = [];
  catalogos: Catalogo[] = [];
  precios: Precio[] = [];
  descuentos: Descuento[] = [];
  extras: Extra[] = [];
  beneficios: Beneficio[] = [];
  servicioUi: ServicioUi | null = null;
  multiviajes: Catalogo[] = [];




  private ventaService = inject(VentasService);
  private notificationModalService = inject(NotificationService);
  private polizasService = inject(PolizasService);
  private servicioService = inject(ServiciosService);
  private extrasService = inject(ExtrasService);
  private planesService = inject(PlanesService);
  private beneficiarioService = inject(BeneficiariosService);
  private cuponesService = inject(CuponesService);
  private preciosService = inject(PreciosService);
  private catalogosService = inject(CatalogosService);
  private beneficiosService = inject(BeneficiosService);

  private activeParams = inject(ActivatedRoute);


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




