import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Beneficiario, Poliza, Servicio } from 'src/app/Modules/Core/models';

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

}
