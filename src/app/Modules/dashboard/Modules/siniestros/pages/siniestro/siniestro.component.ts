import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, switchMap } from 'rxjs';
import { Beneficiario, Catalogo, Plan, Poliza, Servicio, Siniestro } from 'src/app/Modules/Core/models';
import { BeneficiariosService, CatalogosService, PlanesService, PolizasService, ServiciosService, SiniestrosService } from 'src/app/Modules/Core/services';
import { Size, PositionMessage } from 'src/app/Modules/shared/Components/notification/enums';
import { NotificationService } from 'src/app/Modules/shared/Components/notification/notification.service';
import { mapCatPlan, mapTyeSiniestro } from '../../utils/mappers/typeSiniestro.mappers';
import { TipoSiniestro } from '../../models/TipoSiniestro.ui.model';

@Component({
  templateUrl  : './siniestro.component.html',
  styleUrls: ['./siniestro.component.css'],
})
export class SiniestroComponent implements OnInit {
  ngOnInit(): void {
    const { poliza_id, beneficiario_id, siniestro_id } = this.activatedRoute.snapshot.queryParams;

    const process =new Subject();
    const observer = process.asObservable();

    this.onLoading(observer);


    this.polizasService.getOne(poliza_id).pipe(
      switchMap( resp => {
        this.poliza = resp[0];
        return this.beneficiariosService.getOne(poliza_id)
      }),
      switchMap( resp => {
        this.beneficiario = resp[0];
        return this.servicioService.getOne(this.poliza!.servicio_id)
      }),
      switchMap( resp => {
        this.servicio=  resp[0];
        return this.planesService.getOne(this.servicio.servicio_id);
      }),
      switchMap( resp => {
        this.planes = resp;
        return this.siniestroService.getOne(siniestro_id);
      }),
      switchMap( resp => {
          console.log({resp}, "Resp");
          this.siniestro = resp[0];
          return this.catalogoService.getAll()
      } )
    ).subscribe({
      next : ( resp) => {
        this.catalogo = resp.filter( cat => cat.catalogo_id === this.siniestro?.tipo_siniestro)[0];
        this.tipoSiniestro = mapCatPlan(this.catalogo, this.planes);

        this.tipoSiniestro.isSelected= true;

        process.complete();


      },
      error : ( err) => {
        process.complete();
        this.onError(err);

      }
    })
  }


  private activatedRoute = inject(ActivatedRoute);
  private polizasService = inject(PolizasService);
  private beneficiariosService = inject(BeneficiariosService);
  private servicioService = inject(ServiciosService);
  private catalogoService = inject(CatalogosService);
  private planesService = inject(PlanesService);
  private siniestroService = inject(SiniestrosService);


  tipoSiniestro : TipoSiniestro | null = null;


  poliza : Poliza | null = null;
  beneficiario : Beneficiario | null = null;
  servicio : Servicio | null = null;
  planes : Plan[] = [];
  catalogo : Catalogo | null = null;
  siniestro : Siniestro | null = null;
  private notificationModalService = inject(NotificationService);





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
