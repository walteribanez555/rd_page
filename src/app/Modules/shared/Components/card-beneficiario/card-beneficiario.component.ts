import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, inject } from '@angular/core';
import { ServicioUi } from '../../models/Servicio.ui';
import { ModalBenService } from '../modals/modal-beneficiario/service/modal.service';
import { Beneficiario, Poliza, Venta } from 'src/app/Modules/Core/models';

@Component({
  selector: 'card-beneficiario',
  styleUrls: ['./card-beneficiario.component.css'],
  templateUrl: './card-beneficiario.component.html',
})
export class CardBeneficiarioComponent implements OnInit {


  constructor(private modalService  : ModalBenService){

  }
  ngOnInit(): void {
    this.cdr.detectChanges();

  }

  private cdr = inject(ChangeDetectorRef);


  @Input() beneficiario? : Beneficiario;
  @Input()  servicioUi? : ServicioUi;
  @Input() poliza? :Poliza;
  @Input() venta? : Venta;

  openModal(modalTemplate: TemplateRef<any>) {
    this.modalService
      .open(modalTemplate, { size: 'lg', title: 'Walter Ronny Ibañez Saucedo', servicioUi : this.servicioUi!, beneficiario : this.beneficiario!, poliza : this.poliza!, venta : this.venta! })
      .subscribe((action: any) => {
        console.log('modalAction', action);
      });

  }
}
