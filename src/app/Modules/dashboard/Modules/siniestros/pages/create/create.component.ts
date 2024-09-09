import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, switchMap } from 'rxjs';
import {
  Beneficiario,
  Beneficio,
  Catalogo,
  Poliza,
  Servicio,
} from 'src/app/Modules/Core/models';
import {
  BeneficiariosService,
  BeneficiosService,
  CatalogosService,
  PlanesService,
  PolizasService,
  ServiciosService,
  SiniestrosService,
} from 'src/app/Modules/Core/services';
import { mapTyeSiniestro } from '../../utils/mappers/typeSiniestro.mappers';
import { NotificationService } from 'src/app/Modules/shared/Components/notification/notification.service';
import {
  Size,
  PositionMessage,
} from 'src/app/Modules/shared/Components/notification/enums';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoSiniestro } from '../../models/TipoSiniestro.ui.model';
import { ImagesService } from '../../services/images.service';
import { RespBucketS3 } from '../../models/RespBucketS3.model';
import { SiniestroPost } from 'src/app/Modules/Core/models/Siniestro.model';
import { DatesAction } from 'src/app/Modules/shared/utils/dates/dates-action';
import { transformSignalstoString, trasnformStringtoSignals } from '../../utils/mappers/Messages.Mappers';
import { Plan } from 'src/app/Modules/Core/models/Plan.model';


@Component({
  templateUrl: './create.component.html',

  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  ngOnInit(): void {
    const process = new Subject();
    const observerProcess = process.asObservable();

    this.onLoading(observerProcess);

    const { poliza_id, beneficiario } =
      this.activatedRoute.snapshot.queryParams;

    this.polizasService
      .getOne(poliza_id)
      .pipe(
        switchMap((resp: Poliza[]) => {
          this.poliza = resp[0];
          return this.beneficiarioService.getOne(poliza_id);
        }),
        switchMap((resp: Beneficiario[]) => {
          this.beneficiario = resp.filter(
            (ben) => ben.beneficiario_id == beneficiario
          )[0];
          return this.planesService.getOne(this.poliza!.servicio_id);
        }),
        switchMap((resp: Plan[]) => {
          this.planes = resp;
          return this.beneficiosService.getAll();
        }),
        switchMap((resp: Beneficio[]) => {
          this.beneficios = resp;
          console.log(this.beneficios);
          return this.serviciosService.getOne(this.poliza!.servicio_id);
        }),
        switchMap((resp) => {
          this.servicio = resp[0];
          return this.catalogosService.getAll();
        })
      )
      .subscribe({
        next: (resp) => {
          this.catalogos = resp;

          this.tiposSiniestros = mapTyeSiniestro(this.catalogos, this.planes);
          console.log(this.beneficiario);
          process.complete();
        },
        error: (err) => {
          process.complete();
          this.onError(err);
        },
      });
  }

  onChangeType(index: number) {
    this.selectedTipoSiniestro = this.tiposSiniestros[index];
  }
  onSetValidDate(date: string) {
    this.siniestroForm.get('fecha_siniestro')?.setValue(date);
  }

  onFileSelected(event: any) {
    const fileInput = event.target;

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.siniestroForm.get('url_archivo')!.setValue(file);
    }
  }

  selectedTipoSiniestro?: TipoSiniestro;

  siniestroForm = new FormGroup({
    descripcion: new FormControl(null, [Validators.required]),
    fecha_siniestro: new FormControl(),
    pais_ocurrencia: new FormControl(null, [Validators.required]),
    ciudad_ocurrencia: new FormControl(null, [Validators.required]),
    url_archivo: new FormControl(null),
  });

  isFileExtension(value: string): boolean {
    return ['jpg', 'pdf','png', 'jpeg', 'webp', 'tsv', 'xlsx'].includes(value);
  }

  async onSubmitForm() {
    if (!this.selectedTipoSiniestro?.isSelected) {
      this.onError('Se requiere un tipo de siniestro');
      return;
    }

    if (!this.siniestroForm.valid) {
      this.onError('El formulario se relleno incorrectamente');
      return;
    }

    const process = new Subject();
    const observerProcess = process.asObservable();

    this.onLoading(observerProcess);

    const {
      descripcion,
      fecha_siniestro,
      pais_ocurrencia,
      url_archivo,
      ciudad_ocurrencia,
    } = this.siniestroForm.value;

    //Se crea el archivo en el S3 en caso de que exista
    let fileToUpload: File | null = null;

    let filePath = 'no';

    if (url_archivo) {
      fileToUpload = url_archivo as File;
    }

    if(fileToUpload){
      if ( fileToUpload && this.isFileExtension(fileToUpload.name.split('.').reverse()[0])) {
        const resp: RespBucketS3 = await this.imagesService.subirArchivo(
          fileToUpload
        );
        filePath = resp.Location;
      }else{
        process.complete();
        this.onError("File not supported");
        return;
      }
    }


    const nuevoSiniestro: SiniestroPost = {
      descripcion: transformSignalstoString(descripcion! as string),
      fecha_siniestro: DatesAction.invert_date(fecha_siniestro),
      pais_ocurrencia: (pais_ocurrencia! as string)
        .trimEnd()
        .toLocaleUpperCase(),
      ciudad_ocurrencia: (ciudad_ocurrencia! as string)
        .trimEnd()
        .toLocaleUpperCase(),
      url_archivo: filePath,
      beneficiario_id: this.beneficiario!.beneficiario_id!,
      tipo_siniestro: this.selectedTipoSiniestro!.catalogo.valor,
    };

    this.siniestroService.create(nuevoSiniestro).subscribe({
      next: (resp) => {
        process.complete();
        this.onSuccess('Siniestro creado exitosamente');
        this.router.navigateByUrl('/dashboard/siniestros/list');
      },
      error: (err) => {
        process.complete();
        this.onError(err);
      },
    });
  }

  private activatedRoute = inject(ActivatedRoute);
  private beneficiosService = inject(BeneficiosService);
  private serviciosService = inject(ServiciosService);
  private planesService = inject(PlanesService);
  private notificationModalService = inject(NotificationService);

  private polizasService = inject(PolizasService);
  private beneficiarioService = inject(BeneficiariosService);
  private catalogosService = inject(CatalogosService);
  private imagesService = inject(ImagesService);
  private siniestroService = inject(SiniestrosService);
  private router = inject(Router);

  beneficios: Beneficio[] = [];
  servicio: Servicio | null = null;
  planes: Plan[] = [];
  beneficiario: Beneficiario | null = null;

  poliza: Poliza | null = null;
  catalogos: Catalogo[] = [];

  tiposSiniestros: TipoSiniestro[] = [];

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
