import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Observable, forkJoin, map, mergeMap, switchMap } from 'rxjs';
import {
  Beneficio,
  Servicio,
  Catalogo,
  Plan,
} from 'src/app/Modules/Core/models';
import {
  ServiciosService,
  CatalogosService,
  BeneficiosService,
  PlanesService,
} from 'src/app/Modules/Core/services';
import { ServicioUi } from 'src/app/Modules/shared/models';
import { MapToServicioUi } from 'src/app/Modules/shared/utils/mappers/servicio.mappers';



export interface ServByPlan {
  servicio : Servicio;
  planes : Plan[];
}


@Component({
  selector: 'multi-step',
  templateUrl: './multi-step.component.html',
  styleUrls: ['./multi-step.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiStepComponent implements OnInit {
  private serviciosService = inject(ServiciosService);
  private catalogosService = inject(CatalogosService);
  private beneficiosService = inject(BeneficiosService);
  private planesService = inject(PlanesService);

  beneficios: Beneficio[] = [];
  servicios: Servicio[] = [];
  catalogos: Catalogo[] = [];
  planes: Plan[] = [];




  serviciosToUi: ServicioUi[] | null = null;

  constructor() {}

  actualStep: number = 1;

  ngOnInit() {
    this.beneficiosService
      .getAll()
      .pipe(
        switchMap((data) => {
          this.beneficios = data;
          return this.catalogosService.getAll();
        }),
        switchMap((data) => {
          this.catalogos = data;
          return this.serviciosService.getAll();
        }),
        mergeMap((servicios: Servicio[]) => {
          this.servicios = servicios;
          const planesRequests: Observable<any>[] = [];

          servicios.forEach((servicio) => {
            planesRequests.push(
              this.planesService.getOne(servicio.servicio_id).pipe(
                map((planesData) => {
                  return { servicio: servicio, planes: planesData };
                })
              )
            );
          });

          return forkJoin(planesRequests);
        })
      )
      .subscribe({
        next: (data : ServByPlan[] ) => {

          this.serviciosToUi = data.map( item => MapToServicioUi(this.catalogos,this.beneficios,item));
          console.log(this.serviciosToUi);

        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {},
      });
  }

  isClicked: boolean = false;
  isHideInfo: boolean = false;

  onStepClicked(postStep: number) {
    this.onChangeClick();
    this.onChangeStep(postStep);
  }

  onChangeStep(posStep: number) {
    if (posStep == 0 || posStep >= 7) {
      return;
    }
    this.actualStep = posStep;
  }

  onChangeClick() {
    this.isClicked = !this.isClicked;
  }

  onClickInfo() {
    this.isHideInfo = !this.isHideInfo;
  }
}
