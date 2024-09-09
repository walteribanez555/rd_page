import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';
import { parse } from 'path';
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
  Precio,
  Venta,
  Cupon,
  Cliente,
  Poliza,
} from 'src/app/Modules/Core/models';
import {
  Beneficiario,
  BeneficiarioToPost,
} from 'src/app/Modules/Core/models/Beneficiario.model';
import { ClienteToPost } from 'src/app/Modules/Core/models/Cliente.model';
import { Descuento } from 'src/app/Modules/Core/models/Descuento.model';
import { Extra } from 'src/app/Modules/Core/models/Extra.model';
import { Plan } from 'src/app/Modules/Core/models/Plan.model';
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
import { BeneficiarioUi } from 'src/app/Modules/shared/models/Beneficiario.ui';
import { ServicioUi } from 'src/app/Modules/shared/models/Servicio.ui';
import { countrys } from 'src/app/Modules/shared/utils/data/countries-lng';
import { CountryRegion } from 'src/app/Modules/shared/utils/data/countries-region.ts/countries-region';
import { CountryRegionLng } from 'src/app/Modules/shared/utils/data/countries-region.ts/country-region-lng';
import { DatesAction } from 'src/app/Modules/shared/utils/dates/dates-action';
import {
  mapMultiviaje,
  getExpirationDate,
} from 'src/app/Modules/shared/utils/mappers/multiviaje.mappers';
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
  private activatedRoute = inject(ActivatedRoute);

  locationsForm = new FormGroup({
    fromLocation: new FormControl<null | CountryRegionLng[]>(null, [
      Validators.required,
    ]),
    toLocation: new FormControl<null | CountryRegionLng[]>(null, [
      Validators.required,
    ]),
  });

  datesForm = new FormGroup({
    initialDate: new FormControl(null, [Validators.required]),
    finalDate: new FormControl(null, [Validators.required]),
    quantityDays: new FormControl<number | null>(null, [Validators.required]),
  });

  quantityForm = new FormGroup({
    youngQuantity: new FormControl(0, [Validators.required]),
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
    ventRespData: new FormControl<VentaResp[] | null>(
      [],
      [Validators.required]
    ),
  });

  beneficiariosRespForm = new FormGroup({
    polizaRespForm: new FormControl<Poliza[] | null>([], [Validators.required]),
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
  multiviajes: Catalogo[] = [];

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
  origen?: CountryRegionLng;

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.userWeb = params.get('id');
    });

    const process = new Subject();

    const observer = process.asObservable();

    this.onLoading(observer);


    console.log(this.activatedRoute.snapshot.queryParams);


    const { cantidad, origen , destino, fecha_fin, fecha_ini, edades, tipo, country  } =
      this.activatedRoute.snapshot.queryParams;




    if (
      !(cantidad === undefined) &&
      !(destino === undefined) &&
      !(fecha_fin === undefined) &&
      !(fecha_ini === undefined) &&
      !(edades === undefined) &&
      !(tipo === undefined) &&
      !(tipo === undefined)
    ) {
      const initDate = new Date(fecha_ini);
      const finDate = new Date(fecha_fin);
      const diffInMs: number = finDate.getTime() - initDate.getTime();

      // Convierte la diferencia en milisegundos a días
      const diffInDays: number = diffInMs / (1000 * 60 * 60 * 24);

      let destinies : CountryRegionLng[] = [];
      if(destino.length === 4) {

        switch(destino){
          case "AMEN" :
            destinies = [countrys[2]]


          break;

          case "AMEC":
            destinies = [countrys[2]]


          break;

          case "AMES":
            destinies = [countrys[2]]


          break;

          case "EURO":
            destinies = [countrys[5]]


          break;

          case "ASIA":
            destinies = [countrys[1]]


          break;

          case "AFRI":
            destinies = [countrys[4]]


          break;

          case "OCEA":
            destinies = [countrys[3]]


          break;

          case "REST":
            destinies = [countrys[0]]


          break;
          case "LOCL":
            destinies = countrys.filter((country) => country.iso2 === "PE");



          break;


        }


      }else{
        destinies = countrys.filter((country) => country.iso2 === (destino as string).toUpperCase());

      }

      const origins = countrys.filter((countryItem)=> countryItem.iso2 === (( (origen === undefined && country === undefined)? "PE" : origen === undefined ? country : origen) as string).toUpperCase());

      this.locationsForm.get('fromLocation')?.setValue(origins);
      this.locationsForm.get('toLocation')?.setValue(destinies);
      this.datesForm.get('initialDate')?.setValue(fecha_ini);
      this.datesForm.get('finalDate')?.setValue(fecha_fin);
      this.datesForm.get('quantityDays')?.setValue(diffInDays);

      const edadArr = edades.split(',') as string[];

      this.quantityForm
        .get('youngQuantity')
        ?.setValue(edadArr.filter((edad) =>  parseInt(edad) <= 13).length);
      this.quantityForm
        .get('adultQuantity')
        ?.setValue(edadArr.filter((edad) => parseInt(edad) <= 70 && parseInt(edad) >13).length);
      this.quantityForm
        .get('seniorQuantity')
        ?.setValue(
          edadArr.filter((edad) => parseInt(edad) > 70 && parseInt(edad) <= 85)
            .length
        );
    }
    // console.log({fecha_ini, fecha_fin});

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
          return this.catalogosService.getAllExtras();
        }),
        switchMap((data) => {
          this.multiviajes = data;
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
              this.cupones,
              this.multiviajes,
              origen === undefined ? "PE" : origen
            )
          );

          process.complete();
        },
        error: (err) => {
          this.notificationService.show(
            err,
            {
              size: Size.big,
              imageUrl: TypeMessage.error,
              positions: [PositionMessage.center],
              closeOnTouch : true
            }
          );

          process.complete();
        },
        complete: () => {
          if (
            this.locationsForm.valid &&
            this.quantityForm.valid &&
            this.datesForm.valid
          ) {
            this.onChangeStep(4);
          }
          this.cdr.detectChanges();
          process.complete();

        },
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
        .value as unknown as CountryRegionLng;
    }

    if (this.locationsForm.get('toLocation')?.value) {
      this.destinyList = (
        this.locationsForm.get('toLocation')!
          .value as unknown as CountryRegionLng[]
      )
        .map((dest) => dest.iso2)
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
            origen: titularBeneficiario.origen.iso2,
            email: titularBeneficiario.email,
            nro_contacto: titularBeneficiario.telefono,
            status: 1,
            office_id: 2,
            contacto: 2,
            persona_contacto: 'ADMIN',
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

    const multiviajes = (
      this.listForms[3].value.planSelected as ServicioUi
    ).multiviajes.filter((m) => m.isSelected === true);

    const beneficiarios: BeneficiarioUi[] = this.listForms[6].value
      .beneficiariosData as BeneficiarioUi[];

      const { utm_campaign, country } = this.activatedRoute.snapshot.queryParams;

      console.log(utm_campaign);

      let tipoVenta = 2;

      if(utm_campaign === undefined){
        tipoVenta = 2;
      }else{
        if(utm_campaign === "comparaBien"){
          switch (country) {
            case "mx" :
              tipoVenta = 4;
              break;


            case "pe" :
              tipoVenta = 3;
              break;


            case "br" :
              tipoVenta = 5;
              break;


            case "co" :
              tipoVenta = 6;
              break;


            case "es" :
              tipoVenta = 7;
              break;
          }
        }

      }




    const requests: any[] = beneficiarios.map((ben, index) => {
      //FLUJO ACTUAL DE 1 VENTA 1 POLIZA, SE ANOTA EL DETALLE DE LA FACTURA EN LA VENTA COMO RELACIONAMIENTO EXTERNO AL SISTEMA

      const nuevaVenta: VentaToPost = {
        username: 'WEBREDCARD',
        office_id:  2,
        cliente_id: cliente.id ?? cliente.cliente_id!,
        tipo_venta: tipoVenta,
        forma_pago: tipoVenta,
        cantidad: `1`,
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
        descuento: `${(this.listForms[5].value.ventaData.total_cupones[index]) + this.listForms[5].value.ventaData.codigoDescuento / beneficiarios.length}`,
        tipo_descuento: `${this.listForms[5].value.ventaData.tipo_cupones}`,
          multiviajes : mapMultiviaje(this.listForms[3].value.planSelected, this.listForms[1].value.finalDate),
          comision : 0,
      };

      return this.ventasService.create(nuevaVenta).pipe(
        mergeMap((respFromVentas: VentaResp) => {
          const ventaRespActualState = this.ventaRespForm.value;

          ventaRespActualState.ventRespData?.push(respFromVentas);
          console.log({ ventaRespActualState });
          this.ventaRespForm.setValue({
            ventRespData: ventaRespActualState.ventRespData!,
          });

          return this.createExtras(respFromVentas, this.listForms).pipe(
            catchError((err) => throwError(err)),
            map(() => respFromVentas)
          );
        }),
        mergeMap((respFromVentas: VentaResp) => {
          const nuevaPoliza: PolizaToPost = {
            venta_id: respFromVentas.id ?? respFromVentas.venta_id!,
            servicio_id: (this.listForms[3].value.planSelected as ServicioUi)
              .servicio_id,
            destino: (this.listForms[0].value.toLocation as CountryRegionLng[])
              .map((dest) => dest.iso2)
              .join(','),
            fecha_salida: this.listForms[1].value.initialDate,
            fecha_retorno: this.listForms[1].value.finalDate,
            extra: (forms[5].value.ventaData.selectedExtras as Extra[]).length,
            status: 1,
            multiviaje: multiviajes.length > 0 ? 2 : 1,
            fecha_caducidad: getExpirationDate(
              this.listForms[1].value.initialDate
            ),
            username: 'WEBREDCARD',
          };

          return this.polizasService.create(nuevaPoliza);
        }),
        switchMap((poliza: Poliza) => {
          const polizasActualState = this.beneficiariosRespForm.value;
          polizasActualState.polizaRespForm?.push(poliza);
          this.beneficiariosRespForm.setValue({
            polizaRespForm: polizasActualState.polizaRespForm!,
          });

          const beneficiarioToPost: BeneficiarioToPost = {
            poliza_id: poliza.poliza_id ?? poliza.id!,
            primer_apellido: ben.primer_apellido,
            primer_nombre: ben.primer_nombre,
            segundo_apellido: ben.segundo_apellido,
            segundo_nombre: ben.segundo_nombre,
            fecha_nacimiento: ben.fecha_nacimiento,
            sexo: parseInt(ben.sexo),
            origen: ben.origen.iso2,
            email: ben.email,
            telefono: ben.telefono,
            nro_identificacion: ben.nro_identificacion,
          };

          return this.beneficiariosService.create(beneficiarioToPost);
        }),
        catchError((error) => {
          console.error('Error occurred:', error.message);
          return throwError(error);
        })
      );
    });

    forkJoin(requests).subscribe({
      next: (resp) => {
        this.onIntentPayment?.complete();
        console.log(this.listForms, 'DETALLES A REVISAR');
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
