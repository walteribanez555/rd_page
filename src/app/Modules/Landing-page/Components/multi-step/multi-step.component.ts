import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Observer, Subject, filter, forkJoin, map, mergeMap, switchMap } from 'rxjs';
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
import { ServiciosFilter } from 'src/app/Modules/Core/utils/filters';
import {
  Size,
  TypeMessage,
  PositionMessage,
} from 'src/app/Modules/shared/Components/notification/enums';
import { NotificationService } from 'src/app/Modules/shared/Components/notification/notification.service';
import { ServicioUi } from 'src/app/Modules/shared/models';
import { MapToServicioUi } from 'src/app/Modules/shared/utils/mappers/servicio.mappers';

export interface ServByPlan {
  servicio: Servicio;
  planes: Plan[];
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
  private notificationService = inject(NotificationService);
  private serviciosFilter = new ServiciosFilter();

  locationsForm = new FormGroup({
    fromLocation: new FormControl(null, [Validators.required]),
    toLocation: new FormControl(null, [Validators.required]),
  });

  datesForm = new FormGroup({
    initialDate: new FormControl(null, [Validators.required]),
    finalDate: new FormControl(null, [Validators.required]),
    quantityDays : new FormControl(null, [Validators.required]),
  });


  quantityForm = new FormGroup({
    adultQuantity : new FormControl(0, [Validators.required]),
    seniorQuantity : new FormControl(0,[Validators.required])
  });




  listForms: FormGroup[] = [];
  beneficios: Beneficio[] = [];
  servicios: Servicio[] = [];
  catalogos: Catalogo[] = [];
  planes: Plan[] = [];

  serviciosToUi: ServicioUi[] | null = null;



  onSelectDataToPlans?  : Subject<ServicioUi[]>;

  observerServiciosUi? : Observable<ServicioUi[]>


  constructor() {}

  actualStep: number = 1;

  ngOnInit() {
    this.listForms.push(this.locationsForm, this.datesForm, this.quantityForm,);
    this.onSelectDataToPlans = new Subject();

    this.observerServiciosUi = this.onSelectDataToPlans.asObservable();


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
        next: (data: ServByPlan[]) => {
          this.serviciosToUi = data.map((item) =>
            MapToServicioUi(this.catalogos, this.beneficios, item)
          );
        },
        error: (err) => {
          this.notificationService.show(
            "Error en el servidor, por favor volver mas despues",
            {
              size : Size.big,
              imageUrl: TypeMessage.error,
              positions : [PositionMessage.center]
            }
          )
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

    const formsFiltered : FormGroup[] = this.listForms.slice(0,posStep-1);
    const isComplete  = formsFiltered.every( form => form.valid);





    if(!isComplete){
      this.notificationService.show(
        "Debe completar correctamente",
        {
          size : Size.normal,
          positions: [PositionMessage.center],
          imageUrl: TypeMessage.error,
          duration : 2000,
          closeOnTouch : true,
        }
      )

      return;
    }


    if(this.serviciosToUi){
      const filteredServiciosUi : ServicioUi[] = this.serviciosFilter.filterByActions(formsFiltered, posStep-1, this.serviciosToUi);
      this.onSelectDataToPlans?.next(filteredServiciosUi);

    }


    if (posStep == 0 || posStep >= 8) {
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
