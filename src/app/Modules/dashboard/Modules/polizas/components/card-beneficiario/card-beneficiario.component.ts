import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';
import { ModalBenService } from '../modals/modal-beneficiario/service/modal.service';

@Component({
  selector: 'card-beneficiario',
  styleUrls: ['./card-beneficiario.component.css'],
  templateUrl: './card-beneficiario.component.html',
})
export class CardBeneficiarioComponent {


  constructor(private modalService  : ModalBenService){

  }


  openModal(modalTemplate: TemplateRef<any>) {
    this.modalService
      .open(modalTemplate, { size: 'lg', title: 'Walter Ronny Ibañez Saucedo' })
      .subscribe((action: any) => {
        console.log('modalAction', action);
      });
  }
}
