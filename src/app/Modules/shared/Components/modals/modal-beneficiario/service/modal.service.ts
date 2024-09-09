
import {
  ComponentFactoryResolver,
  Inject,
  Injectable,
  Injector,
  TemplateRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { ModalBeneficiarioComponent } from '../modal-beneficiario.component';
import { ServicioUi } from 'src/app/Modules/shared/models/Servicio.ui';
import { Beneficiario, Poliza, Venta } from 'src/app/Modules/Core/models';

@Injectable()
export class ModalBenService {

  private modalNotifier? : Subject<string>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  open(content: TemplateRef<any>, options?: { size?: string; title?: string , servicioUi: ServicioUi, beneficiario : Beneficiario, poliza : Poliza, venta : Venta }) {
    const modalComponentFactory = this.resolver.resolveComponentFactory(
      ModalBeneficiarioComponent
    );
    const contentViewRef = content.createEmbeddedView(null);
    const modalComponent = modalComponentFactory.create(this.injector, [
      contentViewRef.rootNodes,
    ]);

    modalComponent.instance.size = options?.size;
    modalComponent.instance.title = options?.title;
    modalComponent.instance.beneficiario = options?.beneficiario;
    modalComponent.instance.servicioUi = options?.servicioUi;
    modalComponent.instance.poliza = options?.poliza;
    modalComponent.instance.venta = options?.venta;
    modalComponent.instance.closeEvent.subscribe(()=> this.closeModal());
    modalComponent.instance.submitEvent.subscribe(() => this.submitModal());

    modalComponent.hostView.detectChanges();

    this.document.body.appendChild(modalComponent.location.nativeElement);
    this.modalNotifier = new Subject();
    return this.modalNotifier?.asObservable();

  }

  closeModal() {
    this.modalNotifier?.complete();
  }

  submitModal() {
    this.modalNotifier?.next('confirm');
    this.closeModal();
  }
}
