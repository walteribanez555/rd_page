import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Poliza, Servicio, Beneficiario } from 'src/app/Modules/Core/models';

@Component({
  selector: 'card-poliza',
  styleUrls: ['./card-poliza.component.css'],
  templateUrl : './card-poliza.component.html',
})
export class CardPolizaComponent {

  @Input() poliza! : Poliza;

  @Input() servicio! : Servicio;

  @Input() beneficiario! : Beneficiario;

  @Input() isClient : boolean =true;

  getStatusPoliza(state: number) {
    switch (state) {
      case 1:
        return "Proceso"
      case 2:
        return "Espera"
      case 3:
        return "Activa"
      case 4:
        return "Congelada"
      case 5:
        return "Reembolso"
      case 6:
        return "Anulada"
      default :
        return "Vencida"
    }
  }

}
