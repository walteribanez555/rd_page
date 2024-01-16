import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  Observable,
  Subject,
  catchError,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import {
  Beneficio,
  Servicio,
  Catalogo,
  Plan,
  Extra,
  Precio,
  Venta,
  Cupon,
  Cliente,
  Poliza,
} from 'src/app/Modules/Core/models';
import {
  Beneficiario,
  BeneficiarioToPost,
  BeneficiarioToResp,
} from 'src/app/Modules/Core/models/Beneficiario.model';
import { ClienteToPost } from 'src/app/Modules/Core/models/Cliente.model';
import { Descuento } from 'src/app/Modules/Core/models/Descuento.model';
import { PolizaToPost } from 'src/app/Modules/Core/models/Poliza.model';
import { PolizaExtraToPost } from 'src/app/Modules/Core/models/PolizaExtra.model';
import {
  VentaToPost,
  VentaResp,
} from 'src/app/Modules/Core/models/Venta.model';
import {
  ServiciosService,
  CatalogosService,
  BeneficiosService,
  PlanesService,
  DescuentosService,
  ExtrasService,
  PreciosService,
  CuponesService,
  BeneficiariosService,
  ClientesService,
  PolizasService,
  VentasService,
} from 'src/app/Modules/Core/services';
import { PolizasExtrasService } from 'src/app/Modules/Core/services/polizas-extras.service';
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
import { CountryRegion } from 'src/app/Modules/shared/utils/data/countries-region.ts/countries-region';
import { DatesAction } from 'src/app/Modules/shared/utils/dates/dates-action';
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
  private cuponesService = inject(CuponesService);
  private clientesService = inject(ClientesService);
  private polizasService = inject(PolizasService);
  private ventasService = inject(VentasService);
  private notificacionesModalService = inject(NotificationService);
  private polizasExtrasService = inject(PolizasExtrasService);
  private beneficiariosService = inject(BeneficiariosService);
  private cdr = inject(ChangeDetectorRef);

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
    beneficiariosData: new FormControl<BeneficiarioUi[] | null>(null, [
      Validators.required,
    ]),
  });

  ventaRespForm = new FormGroup({
    ventRespData: new FormControl<VentaResp | null>(null, [
      Validators.required,
    ]),
  });

  beneficiariosRespForm = new FormGroup({
    polizaRespForm: new FormControl<Poliza | null>(null, [Validators.required]),
  });

  extrasForm = new FormGroup({});

  listForms: FormGroup[] = [];
  beneficios: Beneficio[] = [];
  servicios: Servicio[] = [];
  catalogos: Catalogo[] = [];
  planes: Plan[] = [];
  descuentos: Descuento[] = [];
  extras: Extra[] = [];
  precios: Precio[] = [];
  cupones: Cupon[] = [];

  serviciosToUi: ServicioUi[] | null = null;

  onSelectDataToPlans?: Subject<ServicioUi[]>;
  onSelectedPlan?: Subject<ServicioUi>;
  onShowDetails?: Subject<any>;

  observerServiciosUi?: Observable<ServicioUi[]>;
  observerOnSelectedPlan?: Observable<ServicioUi>;
  observerOnShowDetails?: Observable<any>;

  onLoadProcess?: Subject<any>;
  observerProcess?: Observable<any>;

  onIntentPayment?: Subject<any>;
  observerPayment?: Observable<any>;

  userWeb: string | null = null;

  constructor() {}

  actualStep: number = 1;

  destinyList: string = '';
  origen?: CountryRegion;

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
      this.ventaRespForm,
      this.beneficiariosRespForm
    );

    this.onSelectDataToPlans = new Subject();
    this.onSelectedPlan = new Subject();
    this.onShowDetails = new Subject();
    this.onIntentPayment = new Subject();

    this.observerServiciosUi = this.onSelectDataToPlans.asObservable();
    this.observerOnSelectedPlan = this.onSelectedPlan.asObservable();
    this.observerOnShowDetails = this.onShowDetails.asObservable();
    this.observerPayment = this.onIntentPayment.asObservable();

    this.beneficiosService
      .getAll()
      .pipe(
        switchMap((data) => {
          this.beneficios = data;
          return this.preciosService.getAll();
        }),
        switchMap((data) => {
          this.precios = data;
          return this.cuponesService.getAll();
        }),
        switchMap((data) => {
          this.cupones = data;
          return this.catalogosService.getAll();
        }),
        switchMap((data) => {
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
              this.precios,
              this.cupones
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

    if (this.locationsForm.get('fromLocation')?.value) {
      this.origen = this.locationsForm.get('fromLocation')!
        .value as unknown as CountryRegion;
    }

    if (this.locationsForm.get('toLocation')?.value) {
      this.destinyList = (
        this.locationsForm.get('toLocation')!
          .value as unknown as CountryRegion[]
      )
        .map((dest) => dest.country)
        .join(',');
    }

    if (this.datesForm.get('quantityDays')!.value) {
      this.serviciosToUi?.forEach((servicio) => {
        servicio.precioSelected = this.preciosFilter.filterByDay(
          servicio,
          this.datesForm.get('quantityDays')!.value!
        );
      });
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

    if (posStep == 8) {
      this.createIntentPayment().subscribe({
        next: (resp) => {
          this.actualStep = posStep;
          this.onShowDetails?.next(this.actualStep);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.actualStep = posStep;
          console.log(this.actualStep);
          this.onShowDetails?.next(this.actualStep);
          this.cdr.detectChanges();
        },
      });
    } else {
      this.actualStep = posStep;
      this.onShowDetails?.next(this.actualStep);
    }
  }

  createIntentPayment(): Observable<any> {
    const beneficiariosData: BeneficiarioUi[] =
      this.listForms[6].value.beneficiariosData;

    const titularBeneficiario = beneficiariosData[0];

    // console.log({titularBeneficiario});

    this.onLoadProcess = new Subject();

    this.observerProcess = this.onLoadProcess.asObservable();

    this.onLoading(this.observerProcess);

    this.clientesService
      .getOne(titularBeneficiario.nro_identificacion)
      .subscribe({
        next: (cliente) => {
          this.createVenta(cliente[0], this.listForms);
        },
        error: (_) => {
          console.log(_);

          const nuevoCliente: ClienteToPost = {
            nombre: titularBeneficiario.primer_nombre,
            apellido: titularBeneficiario.primer_apellido,
            tipo_cliente: 1,
            nro_identificacion: titularBeneficiario.nro_identificacion,
            origen: titularBeneficiario.origen.country,
            email: titularBeneficiario.email,
            nro_contacto: titularBeneficiario.telefono,
            status: 1,
            office_id: 2,
          };

          this.clientesService.create(nuevoCliente).subscribe({
            next: (cliente: Cliente) => {
              this.createVenta(cliente, this.listForms);
            },
            error: (err) => {
              this.onLoadProcess?.complete();
              this.onError(
                'El email ya esta registrado a otro pasaporte o nro identificacion'
              );
            },
            complete: () => {
              console.log('Completado');
            },
          });
        },
      });

    return this.observerProcess;
  }

  createVenta(cliente: Cliente, forms: FormGroup[]) {
    // console.log(this.listForms);

    const nuevaVenta: VentaToPost = {
      username: 'WEBREDCARD',
      office_id: 2,
      cliente_id: cliente.id ?? cliente.cliente_id!,
      tipo_venta: 1,
      forma_pago: 1,
      cantidad: `${this.listForms[6].value.beneficiariosData.length}`,
      servicio_id: `${this.listForms[3].value.planSelected.servicio_id}`,
      extras_id: `${(
        this.listForms[5].value.ventaData.selectedExtras as Extra[]
      )
        .map((selectedExtra: Extra) => selectedExtra.beneficio_id)
        .join(',')}`,
      fecha_salida: this.listForms[1].value.initialDate as string,
      fecha_retorno: this.listForms[1].value.finalDate,
      status: 1,
      plus: 0,
      descuento: `${this.listForms[5].value.ventaData.total_cupones}`,
      tipo_descuento: `${this.listForms[5].value.ventaData.tipo_cupones}`,
    };

    this.ventasService
      .create(nuevaVenta)
      .pipe(
        mergeMap((respFromVentas: VentaResp) => {
          this.ventaRespForm.setValue({ ventRespData: respFromVentas });
          return this.createExtras(respFromVentas, this.listForms).pipe(
            catchError((err) => throwError(err)),
            map(() => respFromVentas)
          );
        }),
        mergeMap((respFromVentas: VentaResp) => {
          const beneficiarios: BeneficiarioUi[] = this.listForms[6].value
            .beneficiariosData as BeneficiarioUi[];

          const requests: any[] = beneficiarios.map((beneficiario) => {
            const nuevaPoliza: PolizaToPost = {
              venta_id: respFromVentas.id ?? respFromVentas.venta_id!,
              servicio_id: (this.listForms[3].value.planSelected as ServicioUi)
                .servicio_id,
              destino: (this.listForms[0].value.toLocation as  CountryRegion[]).map(dest => dest.country).join(','),
              fecha_salida: this.listForms[1].value.initialDate,
              fecha_retorno: this.listForms[1].value.finalDate,
              extra: (forms[5].value.ventaData.selectedExtras as Extra[])
                .length,
              status: 4,
            };

            return this.polizasService.create(nuevaPoliza);
          });

          return forkJoin(requests);
        }),
        switchMap((polizas: any[]) => {
          console.log(polizas);
          this.listForms[8].get('polizaRespForm')?.setValue(polizas);

          const beneficiarios: BeneficiarioUi[] = this.listForms[6].value
            .beneficiariosData as BeneficiarioUi[];

          const beneficiariosToIt: BeneficiarioToPost[] = polizas.map(
            (poliza, index) => {
              return {
                poliza_id: poliza.poliza_id ?? poliza.id!,
                primer_apellido: beneficiarios[index].primer_apellido,
                primer_nombre: beneficiarios[index].primer_nombre,
                segundo_apellido: beneficiarios[index].segundo_apellido,
                segundo_nombre: beneficiarios[index].segundo_nombre,
                fecha_nacimiento: DatesAction.invert_date(
                  beneficiarios[index].fecha_nacimiento
                ),
                sexo: parseInt(beneficiarios[index].sexo),
                origen: beneficiarios[index].origen.country,
                email: beneficiarios[index].email,
                telefono: beneficiarios[index].telefono,
                nro_identificacion: beneficiarios[index].nro_identificacion,
              };
            }
          );

          const requests: any[] = beneficiariosToIt.map((beneficiario) =>
            this.beneficiariosService.create(beneficiario)
          );

          return forkJoin(requests);
        }),
        catchError((error) => {
          console.error('Error occurred:', error.message);
          return throwError(error);
        })
      )
      .subscribe({
        next: (resp: BeneficiarioToResp[]) => {
          this.onIntentPayment?.complete();
        },
        error: (err) => {
          this.onLoadProcess?.complete();
          this.onError('Ocurrio un error');
        },
        complete: () => {
          this.onLoadProcess?.complete();
          this.onSuccess(
            'Cotizacion registrada, se procedera al pago de la venta.'
          );
        },
      });
  }

  createExtras = (venta: VentaResp, forms: FormGroup[]): Observable<any> => {
    if (venta.extras_total.length === 0) {
      return of(true);
    }

    const polizaExtraToPost: PolizaExtraToPost = {
      venta_id: venta.venta_id ?? venta.id!,
      beneficio_id: `${(forms[5].value.ventaData.selectedExtras as Extra[])
        .map((selectedExtra: Extra) => selectedExtra.beneficio_id)
        .join(',')}`,
      monto_adicional: venta.extras_total,
    };

    return this.polizasExtrasService.create(polizaExtraToPost);
  };

  onPlanSelected(servicioUi: ServicioUi) {
    this.onSelectedPlan?.next(servicioUi);
  }

  onChangeClick() {
    this.isClicked = !this.isClicked;
  }

  onClickInfo() {
    this.isHideInfo = !this.isHideInfo;
  }

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
