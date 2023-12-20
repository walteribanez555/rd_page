import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  Observable,
  Observer,
  Subject,
  filter,
  forkJoin,
  map,
  mergeMap,
  switchMap,
} from 'rxjs';
import {
  Beneficio,
  Servicio,
  Catalogo,
  Plan,
  Extra,
  Precio,
  Venta,
} from 'src/app/Modules/Core/models';
import { Descuento } from 'src/app/Modules/Core/models/Descuento.model';
import {
  ServiciosService,
  CatalogosService,
  BeneficiosService,
  PlanesService,
  DescuentosService,
  ExtrasService,
  PreciosService,
} from 'src/app/Modules/Core/services';
import { ServiciosFilter } from 'src/app/Modules/Core/utils/filters';
import { PreciosFilter } from 'src/app/Modules/Core/utils/filters/precios.filters';
import {
  Size,
  TypeMessage,
  PositionMessage,
} from 'src/app/Modules/shared/Components/notification/enums';
import { NotificationService } from 'src/app/Modules/shared/Components/notification/notification.service';
import { ServicioUi } from 'src/app/Modules/shared/models';
import { BeneficiarioUi } from 'src/app/Modules/shared/models/Beneficiario.Ui';
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
  private route = inject(ActivatedRoute);
  private serviciosFilter = new ServiciosFilter();
  private preciosFilter = new PreciosFilter();
  private descuentosService = inject(DescuentosService);
  private extrasService = inject(ExtrasService);
  private preciosService = inject(PreciosService);

  locationsForm = new FormGroup({
    fromLocation: new FormControl(null, [Validators.required]),
    toLocation: new FormControl(null, [Validators.required]),
  });

  datesForm = new FormGroup({
    initialDate: new FormControl(null, [Validators.required]),
    finalDate: new FormControl(null, [Validators.required]),
    quantityDays: new FormControl<number | null>(null, [Validators.required]),
  });

  quantityForm = new FormGroup({
    adultQuantity: new FormControl(0, [Validators.required]),
    seniorQuantity: new FormControl(0, [Validators.required]),
  });

  planForm = new FormGroup({
    planSelected: new FormControl<ServicioUi | null>(null, [
      Validators.required,
    ]),
  });

  ventaForm = new FormGroup({
    ventaData: new FormControl<Venta | null>(null, [Validators.required]),
  });

  beneficiariosForm = new FormGroup({
    beneficiariosData : new FormControl<BeneficiarioUi[] | null>(null,[Validators.required]),
  })

  extrasForm = new FormGroup({});

  listForms: FormGroup[] = [];
  beneficios: Beneficio[] = [];
  servicios: Servicio[] = [];
  catalogos: Catalogo[] = [];
  planes: Plan[] = [];
  descuentos: Descuento[] = [];
  extras: Extra[] = [];
  precios: Precio[] = [];

  serviciosToUi: ServicioUi[] | null = null;

  onSelectDataToPlans?: Subject<ServicioUi[]>;
  onSelectedPlan?: Subject<ServicioUi>;
  onShowDetails?: Subject<any>;

  observerServiciosUi?: Observable<ServicioUi[]>;
  observerOnSelectedPlan?: Observable<ServicioUi>;
  observerOnShowDetails?: Observable<any>;

  userWeb: string | null = null;

  constructor() {}

  actualStep: number = 1;

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.userWeb = params.get('id');
    });

    this.listForms.push(
      this.locationsForm,
      this.datesForm,
      this.quantityForm,
      this.planForm,
      this.extrasForm,
      this.ventaForm,
      this.beneficiariosForm,
    );

    this.onSelectDataToPlans = new Subject();
    this.onSelectedPlan = new Subject();
    this.onShowDetails = new Subject();

    this.observerServiciosUi = this.onSelectDataToPlans.asObservable();
    this.observerOnSelectedPlan = this.onSelectedPlan.asObservable();
    this.observerOnShowDetails = this.onShowDetails.asObservable();

    this.beneficiosService
      .getAll()
      .pipe(
        switchMap((data) => {
          this.beneficios = data;
          return this.preciosService.getAll();
        }),
        switchMap((data) => {
          this.precios = data;
          console.log(this.precios);
          return this.catalogosService.getAll();
        }),
        switchMap((data) => {
          console.log(data);
          this.catalogos = data;
          return this.serviciosService.getAll();
        }),
        switchMap((servicios: Servicio[]) => {
          this.servicios = servicios;
          return this.descuentosService.getAll();
        }),
        switchMap((descuentos: Descuento[]) => {
          this.descuentos = descuentos;
          return this.extrasService.getAll();
        }),
        mergeMap((extras: Extra[]) => {
          this.extras = extras;
          const planesRequests: Observable<any>[] = [];

          this.servicios.forEach((servicio) => {
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
        next: (data: any[]) => {
          this.serviciosToUi = data.map((item) =>
            MapToServicioUi(
              this.catalogos,
              this.beneficios,
              this.extras,
              item,
              this.precios
            )
          );

          console.log(this.serviciosToUi);
        },
        error: (err) => {
          this.notificationService.show(
            'Error en el servidor, por favor volver mas despues',
            {
              size: Size.big,
              imageUrl: TypeMessage.error,
              positions: [PositionMessage.center],
            }
          );
        },
        complete: () => {},
      });

    this.descuentosService.getAll().subscribe((data) => {});
  }

  isClicked: boolean = false;
  isHideInfo: boolean = false;

  onStepClicked(postStep: number) {
    this.onChangeClick();
    this.onChangeStep(postStep);
  }

  onChangeStep(posStep: number) {
    const formsFiltered: FormGroup[] = this.listForms.slice(0, posStep - 1);
    const isComplete = formsFiltered.every((form) => form.valid);

    if (!isComplete) {
      this.notificationService.show('Debe completar correctamente', {
        size: Size.normal,
        positions: [PositionMessage.center],
        imageUrl: TypeMessage.error,
        duration: 2000,
        closeOnTouch: true,
      });

      return;
    }

    if (this.datesForm.get('quantityDays')!.value) {
      this.serviciosToUi?.forEach((servicio) => {
        servicio.precioSelected = this.preciosFilter.filterByDay(
          servicio,
          this.datesForm.get('quantityDays')!.value!
        );
      });
      console.log(this.serviciosToUi);
    }

    if (this.serviciosToUi) {
      const filteredServiciosUi: ServicioUi[] =
        this.serviciosFilter.filterByActions(
          formsFiltered,
          posStep - 1,
          this.serviciosToUi
        );
      this.onSelectDataToPlans?.next(filteredServiciosUi);
    }

    if (posStep == 0 || posStep >= 9) {
      return;
    }

    this.actualStep = posStep;

    this.onShowDetails?.next(this.actualStep);
  }

  onPlanSelected(servicioUi: ServicioUi) {
    this.onSelectedPlan?.next(servicioUi);
  }

  onChangeClick() {
    this.isClicked = !this.isClicked;
  }

  onClickInfo() {
    this.isHideInfo = !this.isHideInfo;
  }
}
